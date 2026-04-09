from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.db_connection import get_db
from database.models import SalarySubmission
from salary_service.schemas import SalaryCreate

app = FastAPI(title="Salary Submission Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/submit")
def submit_salary(data: SalaryCreate, db: Session = Depends(get_db)):
    new_submission = SalarySubmission(
        role=data.role,
        company=data.company,
        country=data.country,
        experience_level=data.experience_level,
        amount=data.amount
    )
    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)
    return {"message": "Submission received", "id": str(new_submission.id)}