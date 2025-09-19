from fastapi import APIRouter
from pydantic import BaseModel
import uuid
from ..crud.access_db import login_user
from sqlmodel import Session
from ..db.database import get_db

router = APIRouter()

@router.post("/login/")
async def login(user_name:str,passward:str,db: Session = Depends(get_db())):
    return login_user(user_name,passward)
