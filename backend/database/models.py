from sqlalchemy import Column, String, DateTime, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from .db_connection import Base

# Identity Schema Tables
class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "identity"}

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Salary Schema Tables
class SalaryRecord(Base):
    __tablename__ = "salaries"
    __table_args__ = {"schema": "salary"}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    job_title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    annual_base_salary = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    location = Column(String)
    years_experience = Column(Integer)

# Community Schema Tables
class Comment(Base):
    __tablename__ = "comments"
    __table_args__ = {"schema": "community"}

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, index=True)
    user_id = Column(Integer)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())