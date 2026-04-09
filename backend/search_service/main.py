from fastapi import FastAPI, Depends, Query
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.db_connection import get_db
from database.models import SalarySubmission
from typing import Optional

app = FastAPI(title="Search Service")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
def search_salaries(
    role: Optional[str] = None,
    company: Optional[str] = None,
    country: Optional[str] = None,
    level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SalarySubmission)
    
    if role:
        query = query.filter(SalarySubmission.role.ilike(f"%{role}%"))
    if company:
        query = query.filter(SalarySubmission.company.ilike(f"%{company}%"))
    if country:
        query = query.filter(SalarySubmission.country == country)
    if level:
        query = query.filter(SalarySubmission.experience_level == level)
        
    results = query.all()
    return jsonable_encoder(results)