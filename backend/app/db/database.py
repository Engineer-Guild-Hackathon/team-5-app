from sqlmodel import create_engine, SQLModel, Session, select
from .table_def import User_table,User_log

user="user_name"
password="user_password"
url="192.168.0.176"
port="3306"
dbname="your_database"

db_url = f"mysql+mysqlconnector://{user}:{password}@{url}:{port}/{dbname}"
engine = create_engine(db_url, echo=False)
SQLModel.metadata.create_all(engine,checkfirst=True)

def get_db():
    with Session(engine) as session:
        yield session

