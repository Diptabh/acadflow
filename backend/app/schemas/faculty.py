from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class FacultyBase(BaseModel):
    name: str
    designation: Optional[str] = None
    department: str
    signature_url: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[EmailStr] = None


class FacultyCreate(FacultyBase):
    user_id: Optional[str] = None


class FacultyUpdate(BaseModel):
    name: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    signature_url: Optional[str] = None
    mobile: Optional[str] = None
    email: Optional[EmailStr] = None


class FacultyResponse(FacultyBase):
    id: str
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
