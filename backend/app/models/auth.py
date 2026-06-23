import re
from pydantic import BaseModel, Field, model_validator
from typing_extensions import Self

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

class UserSignup(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="Minimum 8 characters password")
    confirmPassword: str = Field(..., min_length=8, description="Confirm password field")

    @model_validator(mode="after")
    def validate_signup(self) -> Self:
        # Validate email format
        email_val = self.email.strip().lower()
        if not EMAIL_REGEX.match(email_val):
            raise ValueError("Invalid email address format")
        self.email = email_val

        # Validate passwords match
        if self.password != self.confirmPassword:
            raise ValueError("Passwords do not match")
        
        return self

class UserLogin(BaseModel):
    email: str = Field(...)
    password: str = Field(...)

    @model_validator(mode="after")
    def clean_email(self) -> Self:
        self.email = self.email.strip().lower()
        return self

class UserResponse(BaseModel):
    id: str
    name: str
    email: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
