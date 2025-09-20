from fastapi import APIRouter, Depends
from pydantic import BaseModel
import uuid
from ..crud.access_db import login_user
from sqlmodel import Session
from ..db.database import get_db

router = APIRouter()

@router.post("/login/")
async def login(user_name:str,passward:str,db: Session = Depends(get_db)):
    return login_user(username=user_name,passward=passward,db=db)


#def login_user(db:Session,username:str,passward:str):