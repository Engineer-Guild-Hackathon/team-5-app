# /app/schemas/user_schema.py
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    email: str

class Config:
    orm_mode = True # ORMオブジェクトから自動で変換

class Token(BaseModel):
    access_token: str
    token_type: str