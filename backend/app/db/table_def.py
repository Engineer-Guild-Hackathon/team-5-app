from sqlmodel import SQLModel, Field

class User_table(SQLModel, table=True):
    Email: str = Field(nullable=False,unique=True)
    UserName: str = Field(nullable=False)
    Password: str = Field(nullable=False)
<<<<<<< HEAD
    Id: str = Field(nullable=False,unique=True,primary_key=True)
=======
    Id: str = Field(nullable=False,unique=True,primary_key=True)

class User_log(SQLModel,table=True):
    Id:str = Field(nullable=False,unique=True,primary_key=True)
    original:str = Field(nullable=False)
    translated:str = Field(nullable=False)

class User_score_log(SQLModel,table=True):
    Id:str = Field(nullable=False,unique=True,primary_key=True,foreign_key="user_table.id")
    original:str = Field(nullable=False)
    score:int = Field(nullable=False)
>>>>>>> fc1a10f5a5adc39db13bd0375053eaf46a79533b
