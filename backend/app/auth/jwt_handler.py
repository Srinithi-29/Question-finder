import os
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Union
import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..database.mongodb import get_database
from bson import ObjectId

logger = logging.getLogger(__name__)

# Config variables from environment
JWT_SECRET = os.getenv("JWT_SECRET", "supersecretjwtkeyreplaceinproduction1234567890")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120"))
except ValueError:
    ACCESS_TOKEN_EXPIRE_MINUTES = 120

security = HTTPBearer()

def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.
    """
    salt = bcrypt.gensalt(rounds=10)
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against its bcrypt hash.
    """
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception as e:
        logger.error(f"Error verifying password: {e}")
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Store expiration timestamp in token
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT access token.
    """
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        # Ensure the expiration field is present and valid
        if "exp" in decoded_token:
            exp_timestamp = decoded_token["exp"]
            if datetime.now(timezone.utc).timestamp() > exp_timestamp:
                logger.warning("Token expired")
                return None
            return decoded_token
        return None
    except jwt.PyJWTError as e:
        logger.warning(f"JWT decode error: {e}")
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    FastAPI dependency to retrieve the current user from the authorization token.
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload is missing user ID",
        )
        
    db = get_database()
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        # Fallback in case ObjectId conversion fails
        user = db.users.find_one({"_id": user_id})
        
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    # Return user details, converting _id to string for serialization
    user["_id"] = str(user["_id"])
    # Delete password hash from memory
    user.pop("password", None)
    return user
