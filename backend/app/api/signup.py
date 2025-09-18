from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from ..schemas import user_schema
from ..db.database import get_db
from ..crud import user_crud
from ..core.security import get_password_hash

router = APIRouter()

@router.post("/signup", response_model=user_schema.UserRead)
def create_new_user(
    user_body: user_schema.UserCreate,
    db: Session = Depends(get_db) # ★ 修正点1: DBセッションを取得
):
    # ★ 修正点2: DBセッションを渡してCRUD関数を呼び出す
    if user_crud.get_user_by_email(db=db, email=user_body.email):
        # ★ 修正点3: 文字列ではなくHTTPExceptionを返す
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このメールアドレスは既に使用されています",
        )
    
    # ★ 修正点4: フィールド名を 'name' から 'username' に修正
    if user_crud.get_user_by_username(db=db, username=user_body.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このユーザー名は既に使用されています",
        )
    
    # ★ 修正点5: パスワードをハッシュ化
    hashed_password = get_password_hash(user_body.password)

    # ★ 修正点6: 正しいCRUD関数を呼び出してユーザーを作成
    return user_crud.create_user(db=db, user=user_body, hashed_password=hashed_password)