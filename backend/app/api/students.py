from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.schemas.student import (
    StudentCreate, StudentUpdate, StudentResponse
)
from app.services.supabase import get_supabase_client
from app.services.auth import get_current_user, require_roles

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("", response_model=List[StudentResponse])
async def get_students(
    page: int = 1,
    page_size: int = 50,
    programme: Optional[str] = None,
    year: Optional[int] = None,
    semester: Optional[int] = None,
    section: Optional[str] = None,
    current_user: dict = Depends(require_roles("admin", "faculty", "hod"))
):
    """Get all students with pagination and filters."""
    supabase = get_supabase_client()
    
    query = supabase.table("students").select("*")
    
    # Apply filters
    if programme:
        query = query.eq("programme", programme)
    if year:
        query = query.eq("year", year)
    if semester:
        query = query.eq("semester", semester)
    if section:
        query = query.eq("section", section)
    
    # Pagination
    offset = (page - 1) * page_size
    query = query.range(offset, offset + page_size - 1)
    
    response = query.execute()
    return response.data


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(
    student_id: str,
    current_user: dict = Depends(require_roles("admin", "faculty", "hod", "student"))
):
    """Get a specific student by ID."""
    supabase = get_supabase_client()
    
    # Check access for students
    if current_user.role == "student":
        # Students can only view their own record
        # We would need to look up the student by user_id
        pass
    
    response = supabase.table("students").select("*").eq("id", student_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return response.data[0]


@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student(
    student: StudentCreate,
    current_user: dict = Depends(require_roles("admin"))
):
    """Create a new student."""
    supabase = get_supabase_client()
    
    # Check if university_roll already exists
    existing = supabase.table("students").select("id").eq("university_roll", student.university_roll).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="University roll number already exists")
    
    response = supabase.table("students").insert(student.model_dump(exclude_none=True)).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create student")
    
    return response.data[0]


@router.put("/{student_id}", response_model=StudentResponse)
async def update_student(
    student_id: str,
    student: StudentUpdate,
    current_user: dict = Depends(require_roles("admin"))
):
    """Update a student."""
    supabase = get_supabase_client()
    
    # Check if student exists
    existing = supabase.table("students").select("id").eq("id", student_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Student not found")
    
    response = supabase.table("students").update(
        student.model_dump(exclude_none=True)
    ).eq("id", student_id).execute()
    
    return response.data[0]


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    student_id: str,
    current_user: dict = Depends(require_roles("admin"))
):
    """Delete a student."""
    supabase = get_supabase_client()
    
    response = supabase.table("students").delete().eq("id", student_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return None


@router.post("/import", status_code=status.HTTP_201_CREATED)
async def import_students(
    students: List[StudentCreate],
    current_user: dict = Depends(require_roles("admin"))
):
    """Bulk import students."""
    supabase = get_supabase_client()
    
    student_dicts = [s.model_dump(exclude_none=True) for s in students]
    
    response = supabase.table("students").insert(student_dicts).execute()
    
    return {"created": len(response.data), "students": response.data}
