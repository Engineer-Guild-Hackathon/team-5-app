from fastapi import APIRouter
from pydantic import BaseModel
from sqlmodel import Session
from ..db.database import get_db

router = APIRouter()

@route.post("/signup/")
async def signup(db: Session = Depends(get_db),email:str,user_name:str,passward:str):
    return create_user(email,user_name,passward)