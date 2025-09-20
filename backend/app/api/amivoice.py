from fastapi import FastAPI, UploadFile, File, HTTPException, Form, APIRouter
from dotenv import load_dotenv
import httpx
import os
from ..core.config import AMIVOICE_API_KEY, AMIVOICE_URL
import io
from pydub import AudioSegment

router = APIRouter()

def convert_audio_to_mp3(audio_data: bytes, original_format: str) -> bytes:
    """
    様々な形式の音声・動画データをMP3のバイナリデータに変換する。
    pydubが内部でffmpegを呼び出して処理。
    """
    try:
        # 1. 受け取ったバイナリデータをメモリ上でファイルのように扱う
        audio_stream = io.BytesIO(audio_data)
        
        # 2. pydubで音声データを読み込む
        audio = AudioSegment.from_file(audio_stream, format=original_format)

        # 3. MP3形式に変換して、メモリ上の新しいストリームに書き出す
        mp3_stream = io.BytesIO()
        audio.export(mp3_stream, format="mp3")

        # 4. 変換後のMP3バイナリデータを取得して返す
        return mp3_stream.getvalue()
        
    except Exception as e:
        # pydub (ffmpeg) が対応していない形式などの場合にエラーを投げる
        raise ValueError(f"Failed to convert file with format '{original_format}': {e}")


@router.post("/pronunciation-assessment-en/")
async def pronunciation_assessment_en(
    audio_file: UploadFile = File(..., description="評価する音声・動画ファイル"),
    engine_params: str = Form("-a-general-en", description="AmiVoiceの'd'パラメータ")
):
    """
    クライアントから音声ファイルを受け取り、MP3に変換後、
    AmiVoiceの英語発音評価APIに転送して結果を返す。
    """
    # 1. アップロードされたファイルの内容をメモリに読み込む
    audio_data = await audio_file.read()

    # 2. ファイルをMP3に変換する
    try:
        # ファイル名の拡張子から元のフォーマットを取得
        original_format = audio_file.filename.split('.')[-1].lower()
        mp3_data = convert_audio_to_mp3(audio_data, original_format)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # 予期せぬ変換エラー
        raise HTTPException(status_code=500, detail=f"Audio conversion failed: {e}")

    # 3. AmiVoice APIに送信するデータを作成
    api_data = {
        "u": AMIVOICE_API_KEY,
        "d": engine_params,
    }

    # 4. AmiVoice APIに送信するファイルを準備
    # ファイル名も.mp3に変更し、Content-Typeもmp3用に指定
    mp3_filename = f"{os.path.splitext(audio_file.filename)[0]}.mp3"
    api_files = {
        'a': (mp3_filename, mp3_data, "audio/mpeg")
    }

    # 5. httpxを使って非同期でAmiVoice APIにリクエストを送信
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            print(f"Sending request to {AMIVOICE_URL}...")
            response = await client.post(
                AMIVOICE_URL,
                data=api_data,
                files=api_files,
            )
            response.raise_for_status()

        except httpx.HTTPStatusError as e:
            error_detail = f"AmiVoice API Error: {e.response.status_code} - {e.response.text}"
            raise HTTPException(status_code=e.response.status_code, detail=error_detail)
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"Request to AmiVoice API failed: {e}")

    # 6. レスポンスが成功した場合、JSONをそのままクライアントに返す
    return response.json()