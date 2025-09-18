from fastapi.security import OAuth2PasswordBearer

def get_password_hash(password):
    return pwd_context.hash(password)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def authenticate_user(mail: str, password: str):
    user = user_db.findByMail(mail)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user