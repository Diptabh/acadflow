from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.schemas.faculty import FacultyCreate, FacultyUpdate, FacultyResponse
from app.services.supabase import get_supabase_client
from app.services.auth import require_roles

router = APIRouter(prefix="/faculty", tags=["Faculty"])


@router.get("", response_model=List[FacultyResponse])
async def get_faculty(
    page: int = 1,
    page_size: int = 50,
    department: Optional[str] = None,
    current_user: dict = Depends(require_roles("admin", "hod"))
):
    """Get all faculty members."""
    supabase = get_supabase_client()
    
    query = supabase.table("faculty").select("*")
    
    if department:
        query = query.eq("department", department)
    
    offset = (page - 1) * page_size
    query = query.range(offset, offset + page_size - 1)
    
    response = query.execute()
    return response.data


@router.get("/{faculty_id}", response_model=FacultyResponse)
async def get_faculty_member(
    faculty_id: str,
    current_user: dict = Depends(require_roles("admin", "hod", "faculty"))
):
    """Get a specific faculty member."""
    supabase = get_supabase_client()
    
    response = supabase.table("faculty").select("*").eq("id", faculty_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    
    return response.data[0]


@router.post("", response_model=FacultyResponse, status_code=status.HTTP_201_CREATED)
async def create_faculty(
    faculty: FacultyCreate,
    current_user: dict = Depends(require_roles("admin"))
):
    """Create a new faculty member."""
    supabase = get_supabase_client()
    
    response = supabase.table("faculty").insert(faculty.model_dump(exclude_none=True)).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create faculty")
    
    return response.data[0]


@router.put("/{faculty_id}", response_model=FacultyResponse)
async def update_faculty(
    faculty_id: str,
    faculty: FacultyUpdate,
    current_user: dict = Depends(require_roles("admin"))
):
    """Update a faculty member."""
    supabase = get_supabase_client()
    
    existing = supabase.table("faculty").select("id").eq("id", faculty_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    
    response = supabase.table("faculty").update(
        faculty.model_dump(exclude_none=True)
    ).eq("id", faculty_id).execute()
    
    return response.data[0]


@router.delete("/{faculty_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faculty(
    faculty_id: str,
    current_user: dict = Depends(require_roles("admin"))
):
    """Delete a faculty member."""
    supabase = get_supabase_client()
    
    response = supabase.table("faculty").delete().eq("id", faculty_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    
    return None


@router.put("/{faculty_id}/signature", response_model=FacultyResponse)
async def update_signature(
    faculty_id: str,
    signature_url: str,
    current_user: dict = Depends(require_roles("admin", "faculty"))
):
    """Update faculty signature URL."""
    supabase = get_supabase_client()
    
    response = supabase.table("faculty").update(
        {"signature_url": signature_url}
    ).eq("id", faculty_id).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    
    return response.data[0]
