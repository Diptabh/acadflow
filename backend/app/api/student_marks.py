from fastapi import APIRouter, Depends, HTTPException
from app.utils.auth import get_supabase, get_current_student

router = APIRouter(prefix="/api/student", tags=["Student Data"])

@router.get("/marks")
async def get_my_marks(current_user: dict = Depends(get_current_student)):
    supabase = get_supabase()

    try:
        if getattr(supabase, 'supabase_url', '') == "https://dummy.supabase.co":
            return [
                {
                    "subject": "Mathematics (MA101)",
                    "ca1": {"status": "evaluated", "marks": 18, "pdf_url": "dummy"},
                    "ca2": {"status": "pending", "marks": None, "pdf_url": None},
                    "ca3": {"status": "pdf_generated", "marks": 45, "pdf_url": "dummy2"}
                }
            ]

        student_res = supabase.table("students").select("id").eq("user_id", current_user["sub"]).execute()
        if not student_res.data:
            raise HTTPException(status_code=404, detail="Student not found")
        student_id = student_res.data[0]["id"]

        # Get subjects for this student (we might just fetch all subjects and filter where they have marks,
        # or properly join if possible. Since supabase-py syntax is somewhat limited, we do separate queries)
        # Assuming we just fetch all combined marksheets or individual assessments

        subjects_res = supabase.table("subjects").select("id, name, code").execute()
        subjects = {s["id"]: f"{s['name']} ({s['code']})" for s in subjects_res.data}

        ca1 = supabase.table("ca1_assessments").select("*").eq("student_id", student_id).execute()
        ca2 = supabase.table("ca2_assessments").select("*").eq("student_id", student_id).execute()
        ca3 = supabase.table("ca3_assessments").select("*").eq("student_id", student_id).execute()

        results = []
        for sub_id, sub_name in subjects.items():
            # CA1
            ca1_item = next((item for item in ca1.data if item["subject_id"] == sub_id), None)
            ca1_data = {"status": ca1_item["status"] if ca1_item else "pending", "pdf_url": ca1_item.get("topsheet_url") if ca1_item else None}

            # CA2
            ca2_item = next((item for item in ca2.data if item["subject_id"] == sub_id), None)
            ca2_data = {"status": ca2_item["status"] if ca2_item else "pending", "pdf_url": ca2_item.get("topsheet_url") if ca2_item else None}

            # CA3
            ca3_item = next((item for item in ca3.data if item["subject_id"] == sub_id), None)
            ca3_data = {"status": ca3_item["status"] if ca3_item else "pending", "pdf_url": ca3_item.get("topsheet_url") if ca3_item else None}

            if ca1_item or ca2_item or ca3_item:
                results.append({
                    "subject": sub_name,
                    "ca1": ca1_data,
                    "ca2": ca2_data,
                    "ca3": ca3_data
                })

        return results
    except Exception as e:
        print(f"Error fetching marks: {e}")
        return []
