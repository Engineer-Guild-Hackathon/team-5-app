from fastapi import APIRouter, Depends,HTTPException
from pydantic import BaseModel
from ..service.to_english import japan_to_english,korea_to_english
from ..service.to_japan import english_to_japan,korea_to_japan
from ..service.to_korea import english_to_korea,japan_to_korea
from ..db.table_def import User_log
from sqlmodel import Session
from ..crud.access_db import register_log
from ..db.database import get_db
import json

router = APIRouter()

class Item(BaseModel):
    convert_number:int
    sentence:str

@router.get("/")
async def hello():
    return {"message":"hello hurigana"}

@router.post("/convert/")
async def convert(item:Item,Id:str=None,db: Session = Depends(get_db)):
    match item.convert_number:
        case 1:
            base="english"
            translated="japan"
            ans =  english_to_japan(item.sentence)
        case 2:
            base="english"
            translated="korea"
            ans = english_to_korea(item.sentence)
        case 3:
            base="japan"
            translated="english"
            ans =  japan_to_english(item.sentence)
        case 4:
            base="japan"
            translated="korea"
            ans =  japan_to_korea(item.sentence)
        case 5:
            base="korea"
            translated="english"
            ans =  korea_to_english(item.sentence)
        case 6:
            base="korea"
            translated="japan"
            ans = korea_to_japan(item.sentence)
        case _:
            raise HTTPException(
                status_code=400,
                detail="無効な番号です。convert_numberには1か2を指定してください。"
            )
    register_log(Id=Id,sentence=json.dumps(ans,ensure_ascii=False),base_language=base,translated_language=translated,db=db)
    return ans