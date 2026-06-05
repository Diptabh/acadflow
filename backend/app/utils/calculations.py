import math

def calculate_total(marks_dict: dict) -> int:
    """Calculates total marks from a dictionary of question marks."""
    return sum([int(v) for v in marks_dict.values() if v is not None and str(v).isdigit()])

def calculate_grade(total_marks: int, full_marks: int = 50) -> str:
    """Calculates grade based on total marks."""
    percentage = (total_marks / full_marks) * 100
    if percentage >= 90: return "O"
    elif percentage >= 80: return "E"
    elif percentage >= 70: return "A"
    elif percentage >= 60: return "B"
    elif percentage >= 50: return "C"
    elif percentage >= 40: return "D"
    else: return "F"

def calculate_remark(marks_awarded: int, marks_allotted: int) -> str:
    """Calculates remark per question based on marks awarded vs allotted."""
    if marks_allotted <= 0: return ""
    percentage = (marks_awarded / marks_allotted) * 100
    if percentage >= 80: return "Excellent"
    elif percentage >= 60: return "Good"
    elif percentage >= 40: return "Average"
    else: return "Needs Improvement"

def calculate_ar_ref(marks_awarded: int, marks_allotted: int) -> str:
    """Calculates AR reference (Action Required) per question."""
    if marks_allotted <= 0: return ""
    percentage = (marks_awarded / marks_allotted) * 100
    if percentage < 40: return "AR-1"
    elif percentage < 60: return "AR-2"
    else: return "AR-3"

def generate_feedback(marks_data: dict, total_marks: int) -> dict:
    """Generates overall feedback (strengths, improvement, corrective)."""
    strengths = []
    improvements = []

    # Assume marks_data is a dict like {"1a": {"awarded": 4, "allotted": 5, "co": "CO1"}, ...}
    for q, data in marks_data.items():
        awarded = int(data.get("awarded", 0))
        allotted = int(data.get("allotted", 1))
        percentage = (awarded / allotted) * 100
        co = data.get("co", "")

        if percentage >= 70:
            if co and co not in strengths: strengths.append(co)
        elif percentage < 50:
            if co and co not in improvements: improvements.append(co)

    corrective = "Attend remedial classes for weak areas." if improvements else "Keep up the good work."
    if total_marks < 20:
        corrective = "Mandatory remedial classes and additional assignments."

    return {
        "strengths": ", ".join(strengths) if strengths else "None specific",
        "improvement": ", ".join(improvements) if improvements else "None specific",
        "corrective": corrective
    }
