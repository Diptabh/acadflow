from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.utils.auth import get_supabase, get_current_faculty
from pydantic import BaseModel

router = APIRouter(prefix="/api/sections", tags=["Sections"])

class SectionCreate(BaseModel):
    name: str

@router.get("", response_model=List[str])
async def get_sections(
    current_user: dict = Depends(get_current_faculty)
):
    supabase = get_supabase()
    try:
        response = supabase.table("students").select("section").execute()
        # Extract unique sections
        sections = list(set([item["section"] for item in response.data if item["section"]]))
        return sorted(sections)
    except Exception as e:
        print(e)
        return []

@router.post("", response_model=str, status_code=status.HTTP_201_CREATED)
async def create_section(
    section: SectionCreate,
    current_user: dict = Depends(get_current_faculty)
):
    # Usually sections are not standalone in this schema, they are part of students.
    # We will just return the name as a mock implementation.
    return section.name
