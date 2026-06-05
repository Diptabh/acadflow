from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from typing import List, Optional
from pydantic import BaseModel
from app.utils.auth import get_supabase, get_current_faculty
import pandas as pd
import io
import uuid

router = APIRouter(prefix="/api/students", tags=["Students"])

class StudentCreate(BaseModel):
    name: str
    university_roll: str
    programme: str
    year: int
    semester: int
    section: str
    email: Optional[str] = None
    mobile: Optional[str] = None

class StudentResponse(StudentCreate):
    id: str

@router.get("", response_model=List[StudentResponse])
async def get_students(
    section_id: Optional[str] = None,
    current_user: dict = Depends(get_current_faculty)
):
    supabase = get_supabase()
    
    query = supabase.table("students").select("*")
    if section_id:
        query = query.eq("section", section_id)

    try:
        response = query.execute()
        return response.data
    except Exception as e:
        print(e)
        return []

@router.post("", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student(
    student: StudentCreate,
    current_user: dict = Depends(get_current_faculty)
):
    supabase = get_supabase()
    
    try:
        response = supabase.table("students").insert(student.model_dump(exclude_none=True)).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create student")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/import", status_code=status.HTTP_201_CREATED)
async def import_students(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_faculty)
):
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(status_code=400, detail="Only Excel or CSV files are allowed")

    contents = await file.read()
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))

        required_cols = ['name', 'university_roll', 'programme', 'year', 'semester', 'section']
        for col in required_cols:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Missing required column: {col}")

        # Fill NaNs
        df = df.fillna("")

        students_data = []
        for _, row in df.iterrows():
            student = {
                "name": str(row['name']),
                "university_roll": str(row['university_roll']),
                "programme": str(row['programme']),
                "year": int(row['year']),
                "semester": int(row['semester']),
                "section": str(row['section']),
            }
            if 'email' in df.columns and row['email']:
                student['email'] = str(row['email'])
            if 'mobile' in df.columns and row['mobile']:
                student['mobile'] = str(row['mobile'])
            students_data.append(student)

        supabase = get_supabase()
        response = supabase.table("students").insert(students_data).execute()
        return {"created": len(response.data), "students": response.data}

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")
