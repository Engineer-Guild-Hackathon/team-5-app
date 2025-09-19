from sqlmodel import SQLModel, Field

class User_table(SQLModel, table=True):
    Email: str = Field(nullable=False,unique=True)
    UserName: str = Field(nullable=False)
    Password: str = Field(nullable=False)
    Id: str = Field(nullable=False,unique=True,primary_key=True)

class User_log(SQLModel,table=True):
    Id:str = Field(nullable=False,unique=True,primary_key=True)
    original:str = Field(nullable=False)
    translated:str = Field(nullable=False)

class User_score_log(SQLModel,table=True):
    Id:str = Field(nullable=False,unique=True,primary_key=True,foreign_key="user_table.id")
    original:str = Field(nullable=False)
    score:int = Field(nullable=False)