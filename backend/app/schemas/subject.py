from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SubjectBase(BaseModel):
    code: str
    name: str
    programme: str
    semester: int
    full_marks_ca1: int = 20
    full_marks_ca2: int = 20
    full_marks_ca3: int = 50


class SubjectCreate(SubjectBase):
    faculty_id: Optional[str] = None


class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    programme: Optional[str] = None
    semester: Optional[int] = None
    full_marks_ca1: Optional[int] = None
    full_marks_ca2: Optional[int] = None
    full_marks_ca3: Optional[int] = None
    faculty_id: Optional[str] = None


class SubjectResponse(SubjectBase):
    id: str
    faculty_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CourseOutcomeBase(BaseModel):
    co_number: str
    description: Optional[str] = None
    bloom_level: Optional[str] = None


class CourseOutcomeCreate(CourseOutcomeBase):
    subject_id: str


class CourseOutcomeResponse(CourseOutcomeBase):
    id: str
    subject_id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
