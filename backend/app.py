from fastapi import FastAPI, UploadFile, File,HTTPException, Form,Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import uvicorn
from convert.english_to_japan import english_to_katakana
from convert.japan_to_english import japan_to_english
import httpx


load_dotenv()
AMIVOICE_API_KEY = os.getenv("AMI_voice_APIkey")
AMIVOICE_URL=os.getenv("AMIVOICE_URL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"]
)


class Item(BaseModel):
    convert_number:int
    sentence:str


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/convert/")
async def convert(item:Item):
    print(f"--- Received item.convert_number: {item.convert_number}")
    print(f"--- Type of item.convert_number: {type(item.convert_number)}")
    match item.convert_number:
        case 1:
            return english_to_katakana(item.sentence)
        case 2:
            return japan_to_english(item.sentence)
        case _:
            raise HTTPException(
                status_code=400,
                detail="無効な番号です。convert_numberには1か2を指定してください。"
            )
        
        

@app.post("/pronunciation-assessment-en/")
async def pronunciation_assessment_en(
    audio_file: UploadFile = File(..., description="評価する英語の音声ファイル"),
    engine_params: str = Form("-a-general-en", description="AmiVoiceの'd'パラメータ (発音評価エンジン)")
):
    """
    クライアントから音声ファイルを受け取り、AmiVoiceの英語発音評価APIに転送して結果を返す。
    """
    # 1. アップロードされたファイルの内容をメモリに読み込む
    audio_data = await audio_file.read()

    # 2. AmiVoice APIに送信するデータを作成 (Dartコードの'fields'に相当)
    #    APIキーとエンジン設定
    api_data = {
        "u": AMIVOICE_API_KEY,
        "d": engine_params,
    }

    # 3. AmiVoice APIに送信するファイルを準備 (Dartコードの'files'に相当)
    #    Dartコードの指定通り、キーは 'a' を使用する
    api_files = {
        'a': (audio_file.filename, audio_data, audio_file.content_type)
    }

    # 4. httpxを使って非同期でAmiVoice APIにリクエストを送信
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            print(f"Sending request to {AMIVOICE_URL}...")
            response = await client.post(
                AMIVOICE_URL,
                data=api_data,  # fieldsはこちら
                files=api_files,  # filesはこちら
            )
            # AmiVoice APIからのレスポンスをチェック
            response.raise_for_status()

        except httpx.HTTPStatusError as e:
            # AmiVoice APIからのエラーレスポンスをクライアントに転送
            error_detail = f"AmiVoice API Error: {e.response.status_code} - {e.response.text}"
            raise HTTPException(status_code=e.response.status_code, detail=error_detail)
        except httpx.RequestError as e:
            # ネットワークエラーなど
            raise HTTPException(status_code=500, detail=f"Request to AmiVoice API failed: {e}")

    # 5. レスポンスが成功した場合、JSONをそのままクライアントに返す
    return response.json()



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")