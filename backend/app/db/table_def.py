from sqlmodel import SQLModel, Field

class User_table(SQLModel, table=True):
    Email: str = Field(nullable=False,unique=True)
    UserName: str = Field(nullable=False)
    Password: str = Field(nullable=False)
    Id: str = Field(nullable=False,unique=True,primary_key=True)