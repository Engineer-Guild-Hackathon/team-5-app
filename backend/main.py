import uvicorn
from app.main import app  # app/main.pyからapp本体をインポート

from fastapi.staticfiles import StaticFiles
from fastapi.responses  import FileResponse

app.mount("/_next",StaticFiles(directory="out/_next"),name="static")
app.mount("/images",StaticFiles(directory="out/images"),name="images")

@app.get("/")
async def send_index():
    return FileResponse("out/index.html")

@app.get("/Login")
async def send_Login():
    return FileResponse("out/Login.html")

@app.get("/signin")
async def send_signin():
    return FileResponse("out/signin.html")

@app.get("/mypage")
async def send_mypage():
    return FileResponse("out/mypage.html")

# このファイルが直接実行された場合にサーバーを起動
if __name__ == "__main__":
    print("run")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")