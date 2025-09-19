from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session,Field,SQLModel
from ..db.database import get_db
from ..crud.access_db import response_log
from typing import Dict, Any

router=APIRouter()

class UserResponse(BaseModel):
    Id:str 
    translated_sentence:str
    base_language:str
    translated_language:str


@router.post("/return_log/",response_model=list[UserResponse])
async def return_log(id:str,db: Session = Depends(get_db)):
    return response_log(Id=id,db=db)
    



