import bcrypt
from jose import jwt
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain_password: str, hashed_password: str):
    return bcrypt.checkpw(
        plain_password.encode(),
        hashed_password.encode()
    )


def create_access_token(user_id: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "user_id": user_id,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)