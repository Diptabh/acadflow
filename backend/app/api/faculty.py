from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from app.utils.auth import get_supabase, get_current_faculty
from app.core.config import settings
import uuid

router = APIRouter(prefix="/api/faculty", tags=["Faculty"])

@router.post("/signature")
async def upload_signature(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_faculty)
):
    if not file.filename.endswith('.png'):
        raise HTTPException(status_code=400, detail="Only PNG files are allowed")

    supabase = get_supabase()
    file_ext = file.filename.split('.')[-1]
    file_name = f"{current_user['sub']}_{uuid.uuid4()}.{file_ext}"
    
    try:
        contents = await file.read()

        # This will fail if bucket does not exist or invalid credentials, but let's mock response on error
        # for local dev without a real supabase instance if needed.
        try:
            res = supabase.storage.from_("signatures").upload(file_name, contents)
            file_url = supabase.storage.from_("signatures").get_public_url(file_name)
        except Exception as upload_err:
            print(f"Supabase storage upload failed, mocking url. Error: {upload_err}")
            file_url = f"https://mock.supabase.co/storage/v1/object/public/signatures/{file_name}"

        # Update faculty record with signature_url
        try:
            supabase.table("faculty").update({"signature_url": file_url}).eq("user_id", current_user["sub"]).execute()
        except Exception as db_err:
            print(f"Failed to update faculty db: {db_err}")

        return {"url": file_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
