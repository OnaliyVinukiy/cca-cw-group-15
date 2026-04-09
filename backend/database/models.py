from sqlalchemy import Column, String, DateTime, Integer, Numeric, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from database.db_connection import Base

# Identity Schema Tables
class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "identity"}

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SalarySubmission(Base):
    __tablename__ = "submissions"
    __table_args__ = {"schema": "salary"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(String(100), index=True, nullable=False) 
    company = Column(String(100), index=True, nullable=False)
    country = Column(String(100), index=True, nullable=False)
    
    experience_level = Column(String(50), index=True) 
    amount = Column(Numeric, nullable=False)
    status = Column(String(20), default='PENDING', index=True) # Search only wants 'APPROVED'
    anonymize_flag = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Community Schema Tables
class Vote(Base):
    __tablename__ = "votes"
    __table_args__ = {"schema": "community"}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    submission_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    vote_type = Column(String(10))
    created_at = Column(DateTime(timezone=True), server_default=func.now())