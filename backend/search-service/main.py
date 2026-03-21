from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from database.db_connection import get_db
from database.models import SalarySubmission
from typing import Optional

app = FastAPI(title="Search Service")

@app.get("/search")
def search_salaries(
    role: Optional[str] = None,
    company: Optional[str] = None,
    country: Optional[str] = None,
    level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SalarySubmission).filter(SalarySubmission.status == "APPROVED")
    
    if role:
        query = query.filter(SalarySubmission.role.ilike(f"%{role}%"))
    if company:
        query = query.filter(SalarySubmission.company.ilike(f"%{company}%"))
    if country:
        query = query.filter(SalarySubmission.country == country)
    if level:
        query = query.filter(SalarySubmission.experience_level == level)
        
    results = query.all()
    return results