from fastapi import APIRouter
from pydantic import BaseModel
from ..core.security import get_password_hash,authenticate_user
from ..schemas import user_schema

router = APIRouter()


@router.post("/signup", response_model=user_schema.UserRead)
def create_user(user_body: user_schema.UserCreate):
    user_body.password = get_password_hash(user_body.password)
    return user_db.create(user_body)