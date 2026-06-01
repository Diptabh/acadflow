from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class StudentBase(BaseModel):
    university_roll: str
    name: str
    programme: str
    year: int
    semester: int
    section: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[EmailStr] = None
    upid: Optional[str] = None


class StudentCreate(StudentBase):
    user_id: Optional[str] = None


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    programme: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None
    section: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[EmailStr] = None


class StudentResponse(StudentBase):
    id: str
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
