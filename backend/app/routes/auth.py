import logging
from fastapi import APIRouter, HTTPException, status
from pymongo.errors import DuplicateKeyError
from ..database.mongodb import get_database
from ..models.auth import UserSignup, UserLogin, TokenResponse, UserResponse
from ..auth.jwt_handler import hash_password, verify_password, create_access_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserSignup):
    """
    Register a new user, hashes password, and issues JWT access token.
    """
    db = get_database()
    
    hashed_pass = hash_password(user_data.password)
    
    user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_pass
    }
    
    try:
        result = db.users.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        logger.info(f"Registered new user {user_data.email} with ID {user_id}")
        
        # Automatically log in the user on signup by issuing a JWT
        token = create_access_token(data={"sub": user_id})
        
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserResponse(id=user_id, name=user_data.name, email=user_data.email)
        )
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists"
        )
    except Exception as e:
        logger.error(f"Error during signup: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed due to a database or server error"
        )

@router.post("/login", response_model=TokenResponse)
def login(user_data: UserLogin):
    """
    Authenticate user credentials and issues a JWT access token.
    """
    db = get_database()
    
    user = db.users.find_one({"email": user_data.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    if not verify_password(user_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
        
    user_id = str(user["_id"])
    token = create_access_token(data={"sub": user_id})
    
    logger.info(f"User logged in: {user_data.email}")
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(id=user_id, name=user["name"], email=user["email"])
    )
