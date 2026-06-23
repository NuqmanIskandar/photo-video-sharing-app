from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None

class UserPublic(BaseModel):
    username: str
    full_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class Post(BaseModel):
    id: str
    username: str
    caption: str
    url: str
    file_id: str
    file_type: str
    file_name: str
    created_at: datetime

class UploadResponse(BaseModel):
    file_id: str
    file_name: str
    url: str
