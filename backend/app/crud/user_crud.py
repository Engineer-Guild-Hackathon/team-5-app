from sqlmodel import Session, select
from ..db.models import User
from ..schemas.user_schema import UserCreate

def get_user_by_email(db: Session, email: str) -> User | None:
    """メールアドレスでユーザーを検索する"""
    statement = select(User).where(User.email == email)
    return db.exec(statement).first()

def get_user_by_username(db: Session, username: str) -> User | None:
    """ユーザー名でユーザーを検索する"""
    # ★ 修正点: モデルのフィールド名は 'username'
    statement = select(User).where(User.username == username)
    return db.exec(statement).first()

def create_user(db: Session, user: UserCreate, hashed_password: str) -> User:
    """新しいユーザーを作成する"""
    # スキーマからモデルのインスタンスを作成
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    
    # データベースに追加してコミット
    db.add(db_user)
    db.commit()
    db.refresh(db_user) # 作成したデータをリフレッシュしてIDなどを取得
    
    return db_user