from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext

# 1. ハッシュ化のアルゴリズムとしてbcryptを指定して、コンテキストを作成
#    このインスタンスが、ハッシュ化と検証のすべての処理を行います。
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)
