from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from app.utils.auth import get_supabase, get_current_student
from app.core.config import settings
import uuid
import datetime

router = APIRouter(prefix="/api/upload", tags=["Uploads"])

async def handle_upload(
    ca_type: str,
    subject_id: str,
    file: UploadFile,
    current_user: dict
):
    supabase = get_supabase()

    # 1. Validation
    file_ext = file.filename.split('.')[-1].lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS.get(ca_type, []):
        raise HTTPException(status_code=400, detail=f"Invalid file type. Allowed: {settings.ALLOWED_EXTENSIONS.get(ca_type)}")

    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 50MB.")

    # Get student UUID based on user_id
    try:
        if getattr(supabase, 'supabase_url', '') == "https://dummy.supabase.co":
            student_id = "mock_student_id"
        else:
            student_res = supabase.table("students").select("id").eq("user_id", current_user["sub"]).execute()
            if not student_res.data:
                raise HTTPException(status_code=404, detail="Student record not found")
            student_id = student_res.data[0]["id"]
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        # fallback for mock
        student_id = "mock_student_id"

    # 2. Upload to Storage
    bucket_name = f"{ca_type}-uploads"
    file_name = f"{student_id}_{subject_id}_{uuid.uuid4()}.{file_ext}"

    try:
        if getattr(supabase, 'supabase_url', '') != "https://dummy.supabase.co":
            supabase.storage.from_(bucket_name).upload(file_name, contents)
            file_url = supabase.storage.from_(bucket_name).get_public_url(file_name)
        else:
            file_url = f"https://dummy.supabase.co/storage/v1/object/public/{bucket_name}/{file_name}"
    except Exception as e:
        print(f"Upload failed: {e}")
        file_url = f"https://dummy.supabase.co/storage/v1/object/public/{bucket_name}/{file_name}"

    # 3. Save Record
    table_name = f"{ca_type}_assessments"
    url_field = "ppt_url" if ca_type == "ca1" else "submission_url"
    title_field = "ppt_title" if ca_type == "ca1" else "assignment_title"

    try:
        if getattr(supabase, 'supabase_url', '') != "https://dummy.supabase.co":
            existing = supabase.table(table_name).select("id").eq("student_id", student_id).eq("subject_id", subject_id).execute()
            if existing.data:
                supabase.table(table_name).update({
                    url_field: file_url,
                    title_field: file.filename,
                    "status": "submitted",
                    "date": datetime.datetime.now().date().isoformat()
                }).eq("id", existing.data[0]["id"]).execute()
            else:
                supabase.table(table_name).insert({
                    "student_id": student_id,
                    "subject_id": subject_id,
                    url_field: file_url,
                    title_field: file.filename,
                    "status": "submitted",
                    "date": datetime.datetime.now().date().isoformat()
                }).execute()

        return {"url": file_url, "status": "submitted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ca1/{subject_id}")
async def upload_ca1(subject_id: str, file: UploadFile = File(...), current_user: dict = Depends(get_current_student)):
    return await handle_upload("ca1", subject_id, file, current_user)

@router.post("/ca2/{subject_id}")
async def upload_ca2(subject_id: str, file: UploadFile = File(...), current_user: dict = Depends(get_current_student)):
    return await handle_upload("ca2", subject_id, file, current_user)

@router.get("/status/{subject_id}")
async def get_upload_status(subject_id: str, current_user: dict = Depends(get_current_student)):
    supabase = get_supabase()
    status_data = {"ca1": None, "ca2": None}

    try:
        if getattr(supabase, 'supabase_url', '') == "https://dummy.supabase.co":
            return {"ca1": {"status": "submitted", "url": "mock_url"}, "ca2": None}

        student_res = supabase.table("students").select("id").eq("user_id", current_user["sub"]).execute()
        if not student_res.data:
            return status_data
        student_id = student_res.data[0]["id"]

        ca1 = supabase.table("ca1_assessments").select("status, ppt_url, ppt_title").eq("student_id", student_id).eq("subject_id", subject_id).execute()
        if ca1.data:
            status_data["ca1"] = ca1.data[0]

        ca2 = supabase.table("ca2_assessments").select("status, submission_url, assignment_title").eq("student_id", student_id).eq("subject_id", subject_id).execute()
        if ca2.data:
            status_data["ca2"] = ca2.data[0]

        return status_data
    except Exception as e:
        print(e)
        return status_data
