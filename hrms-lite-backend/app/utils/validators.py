from fastapi import HTTPException, status

# Allowed attendance statuses
ALLOWED_STATUS = ["Present", "Absent"]

def validate_attendance_status(status_value: str):
    """
    Ensure that attendance status is either 'Present' or 'Absent'.
    """
    if status_value not in ALLOWED_STATUS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed values: {ALLOWED_STATUS}"
        )

