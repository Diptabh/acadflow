from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from pydantic import BaseModel
from app.utils.auth import get_supabase, get_current_faculty

router = APIRouter(prefix="/api/subjects", tags=["Subjects"])

class SubjectCreate(BaseModel):
    code: str
    name: str
    programme: str
    semester: int
    full_marks_ca1: int = 20
    full_marks_ca2: int = 20
    full_marks_ca3: int = 50

class SubjectResponse(SubjectCreate):
    id: str
    faculty_id: Optional[str] = None

class COCreate(BaseModel):
    co_number: str
    description: str
    bloom_level: str

class COResponse(COCreate):
    id: str
    subject_id: str

@router.get("", response_model=List[SubjectResponse])
async def get_subjects(
    current_user: dict = Depends(get_current_faculty)
):
    supabase = get_supabase()
    
    try:
        # Dummy mock mode
        if current_user.get("role") == "faculty" and current_user.get("sub") == "123":
            return []

        # Normally filter by faculty_id or similar, but for now return all or map to faculty.
        response = supabase.table("subjects").select("*").execute()
        return response.data
    except Exception as e:
        print(e)
        return []

@router.post("", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
    subject: SubjectCreate,
    current_user: dict = Depends(get_current_faculty)
):
    supabase = get_supabase()
    
    try:
        # Assume faculty has a record in faculty table with matching user_id
        faculty_res = supabase.table("faculty").select("id").eq("user_id", current_user["sub"]).execute()
        faculty_id = faculty_res.data[0]["id"] if faculty_res.data else None

        data = subject.model_dump()
        data["faculty_id"] = faculty_id

        response = supabase.table("subjects").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{subject_id}/cos", response_model=List[COResponse])
async def get_subject_cos(
    subject_id: str,
    current_user: dict = Depends(get_current_faculty)
):
    supabase = get_supabase()
    try:
        response = supabase.table("course_outcomes").select("*").eq("subject_id", subject_id).execute()
        return response.data
    except Exception as e:
        return []

@router.post("/{subject_id}/cos", response_model=COResponse, status_code=status.HTTP_201_CREATED)
async def create_subject_co(
    subject_id: str,
    co: COCreate,
    current_user: dict = Depends(get_current_faculty)
):
    supabase = get_supabase()
    try:
        data = co.model_dump()
        data["subject_id"] = subject_id
        response = supabase.table("course_outcomes").insert(data).execute()
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
