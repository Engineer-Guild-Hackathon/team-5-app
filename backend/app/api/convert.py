from fastapi import APIRouter
from pydantic import BaseModel
from ..service.to_english import japan_to_english,korea_to_english
from ..service.to_japan import english_to_japan,korea_to_japan
from ..service.to_korea import english_to_korea,japan_to_korea



router = APIRouter()

class Item(BaseModel):
    convert_number:int
    sentence:str


@router.get("/")
async def hello():
    return {"message":"hello hurigana"}

@router.post("/convert/")
async def convert(item:Item):
    match item.convert_number:
        case 1:
            return english_to_japan(item.sentence)
        case 2:
            return english_to_korea(item.sentence)
        case 3:
            return japan_to_english(item.sentence)
        case 4:
            return japan_to_korea(item.sentence)
        case 5:
            return korea_to_english(item.sentence)
        case 6:
            return korea_to_japan(item.sentence)
        case _:
            raise HTTPException(
                status_code=400,
                detail="無効な番号です。convert_numberには1か2を指定してください。"
            )
        