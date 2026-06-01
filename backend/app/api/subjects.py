from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.schemas.subject import (
    SubjectCreate, SubjectUpdate, SubjectResponse,
    CourseOutcomeCreate, CourseOutcomeResponse
)
from app.services.supabase import get_supabase_client
from app.services.auth import require_roles, get_current_user

router = APIRouter(prefix="/subjects", tags=["Subjects"])


@router.get("", response_model=List[SubjectResponse])
async def get_subjects(
    page: int = 1,
    page_size: int = 50,
    programme: Optional[str] = None,
    semester: Optional[int] = None,
    faculty_id: Optional[str] = None,
    current_user: dict = Depends(require_roles("admin", "faculty", "hod"))
):
    """Get all subjects."""
    supabase = get_supabase_client()
    
    query = supabase.table("subjects").select("*")
    
    if programme:
        query = query.eq("programme", programme)
    if semester:
        query = query.eq("semester", semester)
    if faculty_id:
        query = query.eq("faculty_id", faculty_id)
    
    offset = (page - 1) * page_size
    query = query.range(offset, offset + page_size - 1)
    
    response = query.execute()
    return response.data


@router.get("/my", response_model=List[SubjectResponse])
async def get_my_subjects(current_user: dict = Depends(require_roles("faculty"))):
    """Get subjects assigned to the current faculty."""
    supabase = get_supabase_client()
    
    # Get faculty record for current user
    faculty_response = supabase.table("faculty").select("id").eq("user_id", current_user.user_id).execute()
    
    if not faculty_response.data:
        return []
    
    faculty_id = faculty_response.data[0]["id"]
    
    response = supabase.table("subjects").select("*").eq("faculty_id", faculty_id).execute()
    return response.data


@router.get("/{subject_id}", response_model=SubjectResponse)
async def get_subject(
    subject_id: str,
    current_user: dict = Depends(require_roles("admin", "faculty", "hod", "student"))
):
    """Get a specific subject."""
    supabase = get_supabase_client()
    
    response = supabase.table("subjects").select("*").eq("id", subject_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    return response.data[0]


@router.post("", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
    subject: SubjectCreate,
    current_user: dict = Depends(require_roles("admin"))
):
    """Create a new subject."""
    supabase = get_supabase_client()
    
    # Check if subject code already exists
    existing = supabase.table("subjects").select("id").eq("code", subject.code).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Subject code already exists")
    
    response = supabase.table("subjects").insert(subject.model_dump(exclude_none=True)).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create subject")
    
    return response.data[0]


@router.put("/{subject_id}", response_model=SubjectResponse)
async def update_subject(
    subject_id: str,
    subject: SubjectUpdate,
    current_user: dict = Depends(require_roles("admin"))
):
    """Update a subject."""
    supabase = get_supabase_client()
    
    existing = supabase.table("subjects").select("id").eq("id", subject_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    response = supabase.table("subjects").update(
        subject.model_dump(exclude_none=True)
    ).eq("id", subject_id).execute()
    
    return response.data[0]


@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject(
    subject_id: str,
    current_user: dict = Depends(require_roles("admin"))
):
    """Delete a subject."""
    supabase = get_supabase_client()
    
    response = supabase.table("subjects").delete().eq("id", subject_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    return None


# Course Outcomes endpoints
@router.get("/{subject_id}/course-outcomes", response_model=List[CourseOutcomeResponse])
async def get_course_outcomes(
    subject_id: str,
    current_user: dict = Depends(require_roles("admin", "faculty", "hod"))
):
    """Get course outcomes for a subject."""
    supabase = get_supabase_client()
    
    response = supabase.table("course_outcomes").select("*").eq("subject_id", subject_id).execute()
    return response.data


@router.post("/{subject_id}/course-outcomes", response_model=CourseOutcomeResponse, status_code=status.HTTP_201_CREATED)
async def create_course_outcome(
    subject_id: str,
    outcome: CourseOutcomeCreate,
    current_user: dict = Depends(require_roles("admin", "faculty"))
):
    """Create a course outcome for a subject."""
    supabase = get_supabase_client()
    
    # Verify subject exists
    subject = supabase.table("subjects").select("id").eq("id", subject_id).execute()
    if not subject.data:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    outcome_data = outcome.model_dump()
    outcome_data["subject_id"] = subject_id
    
    response = supabase.table("course_outcomes").insert(outcome_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create course outcome")
    
    return response.data[0]


@router.delete("/{subject_id}/course-outcomes/{co_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course_outcome(
    subject_id: str,
    co_id: str,
    current_user: dict = Depends(require_roles("admin", "faculty"))
):
    """Delete a course outcome."""
    supabase = get_supabase_client()
    
    response = supabase.table("course_outcomes").delete().eq("id", co_id).execute()
    
    return None
