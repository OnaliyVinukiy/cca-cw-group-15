# backend/identity_service/main.py

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.db_connection import get_db, engine
from database.models import User, Base
from identity_service.schemas import UserCreate, UserLogin
from identity_service.auth import hash_password, verify_password, create_access_token
import uuid
import os
from dotenv import load_dotenv
from sqlalchemy import text

# Load environment variables from .env
load_dotenv()

app = FastAPI(title="Identity Service API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

with engine.connect() as conn:
    conn.execute(text("CREATE SCHEMA IF NOT EXISTS identity"))
    conn.commit()

Base.metadata.create_all(bind=engine)

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        user_id=uuid.uuid4(),
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created successfully"}


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(str(db_user.user_id))

    return {
        "access_token": token,
        "token_type": "bearer"
    }