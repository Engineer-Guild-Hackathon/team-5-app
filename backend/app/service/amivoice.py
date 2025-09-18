from fastapi import UploadFile, File,HTTPException, Form
import httpx
from dotenv import load_dotenv
import os
import json

# --- 準備 ---
# .envファイルから環境変数を読み込む
load_dotenv()
# APPKEYを.envファイルから取得
AMIVOICE_APP_KEY = os.getenv("AMI_voice_APIkey")
AMIVOICE_URL = "https://acp-api.amivoice.com/v2/recognize"
# テストしたい音声ファイル
AUDIO_FILE_PATH = "test.mp3"
# AmiVoiceの'd'パラメータ (発音評価エンジン)
ENGINE_PARAMS = "-a-general-en"

def main():
    """
    AmiVoiceの英語発音評価APIに音声ファイルを送信して結果を表示する。
    """
    if not AMIVOICE_APP_KEY:
        print("エラー: .envファイルに 'AMI_voice_APPkey' を設定してください。")
        return

    try:
        # 1. 音声ファイルをバイナリモードで開く
        with open(AUDIO_FILE_PATH, "rb") as audio_file:
            
            # 2. AmiVoice APIに送信するデータを作成
            #    APIキーとエンジン設定
            api_data = {
                "u": AMIVOICE_APP_KEY,
                "d": ENGINE_PARAMS,
            }

            # 3. AmiVoice APIに送信するファイルを準備
            #    キーは 'a' を使用する
            api_files = {
                'a': (os.path.basename(AUDIO_FILE_PATH), audio_file, "audio/mpeg")
            }

            # 4. httpxを使ってAmiVoice APIにリクエストを送信 (同期処理)
            with httpx.Client(timeout=60.0) as client:
                print(f"'{AUDIO_FILE_PATH}'をAmiVoice APIに送信中...")
                
                response = client.post(
                    AMIVOICE_URL,
                    data=api_data,
                    files=api_files,
                )
                
                # AmiVoice APIからのレスポンスをチェック
                response.raise_for_status()
                
                # 5. 成功した場合、結果のJSONを整形して表示
                print("\n--- 成功: AmiVoiceからのレスポンス ---")
                response_json = response.json()
                print(json.dumps(response_json, indent=2, ensure_ascii=False))

    except FileNotFoundError:
        print(f"エラー: 音声ファイル '{AUDIO_FILE_PATH}' が見つかりません。")
    except httpx.HTTPStatusError as e:
        # AmiVoice APIからのエラーレスポンス
        print(f"\n--- エラー: AmiVoice APIからの応答 ({e.response.status_code}) ---")
        print(e.response.text)
    except httpx.RequestError as e:
        # ネットワークエラーなど
        print(f"\n--- エラー: リクエストに失敗しました ---")
        print(e)
    except Exception as e:
        # その他の予期せぬエラー
        print(f"\n--- 予期せぬエラーが発生しました ---")
        print(e)

if __name__ == "__main__":
    main()