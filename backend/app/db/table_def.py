from sqlmodel import SQLModel, Field, Column
from typing import Dict, Any,Optional
from sqlalchemy.dialects.mysql import JSON


class User_table(SQLModel, table=True):
    Email: str = Field(nullable=False,unique=True)
    UserName: str = Field(nullable=False)
    Password: str = Field(nullable=False)
    Id: str = Field(nullable=False,unique=True,primary_key=True)

class User_log(SQLModel, table=True):
    log_id: Optional[int] = Field(default=None, primary_key=True)
    Id: str = Field(foreign_key="user_table.Id")
    translated_sentence: str = Field(sa_column=Column(JSON))
    base_language: str = Field(nullable=False)
    translated_language: str = Field(nullable=False)


class User_score_log(SQLModel,table=True):
    Id:str = Field(nullable=False,unique=True,primary_key=True,foreign_key="user_table.Id")
    original:str = Field(nullable=False)
    score:int = Field(nullable=False)
