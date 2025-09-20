from sqlmodel import Session, select
from ..db.table_def import User_table,User_log
from ..schemas.user_schema import UserCreate
import uuid
from ..core.security import get_password_hash ,verify_password
from fastapi import HTTPException, status
from sqlalchemy.dialects.mysql import JSON
import json

def get_user_by_username(db: Session, username: str) -> User_table | None:
    statement = select(User_table).where(User_table.UserName == username)
    return db.exec(statement).first()

def get_user_by_email(db: Session, email: str) -> User_table | None:
    statement = select(User_table).where(User_table.Email == email)
    return db.exec(statement).first()

def confirm_user_by_username(db: Session, username: str):
    statement = select(User_table).where(User_table.UserName == username)
    if statement:
        return True
    else:
        return False

def login_user(db:Session,username:str,passward:str):
    statement = select(User_table).where(User_table.UserName == username)
    existing_user=db.exec(statement).first()
    if verify_password(passward, existing_user.Password):
        return existing_user.Id
    else:
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="ユーザー名あるいはパスワードが間違っています",
        )

def create_user(db: Session,username:str,email:str, hashed_password: str):
    existing_user=get_user_by_username(db,username)
    if existing_user:
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="このユーザー名は既に使用されています",
        )
    existing_user=get_user_by_email(db,email)
    if existing_user:
        raise  HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このEmailはは既に使用されています",
        )
    user_id =str(uuid.uuid4())
    db_user = User_table(
    Email=email,
    UserName=username,
    Password=hashed_password, # ハッシュ化されたパスワード
    Id=user_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return user_id

def register_log(db:Session,Id:str,sentence:str,base_language:str,translated_language:str):
    user_log=User_log(
        Id=Id,
        translated_sentence=sentence,
        base_language=base_language,
        translated_language=translated_language
    )
    db.add(user_log)
    db.commit()
    db.refresh(user_log)

"""class User_log(SQLModel, table=True):
    Id: str = Field(foreign_key="user_table.Id")
    translated_sentence: Dict[str, Any] = Field(sa_column=Column(JSON), nullable=False)
    base_language: str = Field(nullable=False)
    translated_language: str = Field(nullable=False)"""

def response_log(db:Session,Id:str):
    statement = select(User_log).where(User_log.Id == Id)
    return db.exec(statement).all()