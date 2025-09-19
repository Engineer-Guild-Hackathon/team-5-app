from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session
from ..db.database import get_db
from ..crud.access_db import create_user
from ..core.security import get_password_hash 

router = APIRouter()

@router.post("/signup/")
async def signup(email:str,user_name:str,passward:str,db: Session = Depends(get_db),):
    hashed_password=get_password_hash(passward)
    return create_user(email=email,username=user_name,hashed_password=hashed_password,db=db)

