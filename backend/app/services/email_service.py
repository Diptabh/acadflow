import os
import resend
from app.core.config import settings

def send_topsheet_email(student_email: str, pdf_url: str, subject_code: str):
    """Sends email with the generated PDF URL via Resend."""
    if not settings.RESEND_API_KEY:
        print(f"Mock Email sent to {student_email} with PDF: {pdf_url}")
        return True

    resend.api_key = settings.RESEND_API_KEY
    try:
        html_content = f"""
        <p>Dear Student,</p>
        <p>Your CA3 marks for {subject_code} have been evaluated. You can download your topsheet from the link below:</p>
        <a href="{pdf_url}">Download Topsheet</a>
        <p>Best Regards,<br>AcadFlow Team</p>
        """
        r = resend.Emails.send({
            "from": settings.EMAIL_FROM,
            "to": [student_email],
            "subject": f"CA3 Evaluation Topsheet - {subject_code}",
            "html": html_content
        })
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

def send_bulk_emails(email_list: list):
    """Sends bulk emails."""
    for item in email_list:
        send_topsheet_email(item['email'], item['pdf_url'], item['subject_code'])
