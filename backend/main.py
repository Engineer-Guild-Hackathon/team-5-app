import uvicorn
from app.main import app  # app/main.pyからapp本体をインポート

# このファイルが直接実行された場合にサーバーを起動
if __name__ == "__main__":
    print("run")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")