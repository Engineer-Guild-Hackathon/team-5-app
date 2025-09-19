from sqlmodel import create_engine, SQLModel, Session, select
from .table_def import User_table

class DB:
    """
        DBと接続するクラスです。
    """

    def __init__(
        self, url: str, user: str, password: str, dbname: str, port: str = "3306"
    )->None:
        """
        引数:
            url (str): DBのアドレス
            user (str): アクセスするユーザーの名前
            password (str): アクセスするユーザーのパスワード
            dbname (str): データベース名
            port (str, default=3306): データベースのポート番号
        """

        db_url = f"mysql+mysqlconnector://{user}:{password}@{url}:{port}/{dbname}"
        self.engine = create_engine(db_url, echo=False)
        SQLModel.metadata.create_all(self.engine,checkfirst=True)
    
    def insert_user_table(
        self, e_mail:str, user_name:str, password:str,id:str
    )->None:
        """

            ユーザーを登録します。

            引数:
                e_mail (str): ユーザーのEmailアドレス
                user_name (str): ユーザーの名前
                password (str) :ユーザーのパスワード
                id (str): ユーザーを識別するid
        """

        with Session(self.engine) as session:
            try:
                add_user = User_table(Email=e_mail,UserName=user_name,Password=password,Id=id)
                session.add(add_user)
                session.commit()
            except:
                pass
            finally:
                session.close()
    
    def select_user_table(
        self,values:dict[str,object]
    ):
        """

        user_tableから任意のデータを出力します。

        引数:
            values (辞書型): データベースのカラム名とその値を入れてください
        
        返り値:
            list[User_table]
        """

        with Session(self.engine) as session:
            stmt = select(User_table)
            conditions = []
            for k, v in values.items():
                if hasattr(User_table, k):          # attribute exists?
                    col = getattr(User_table, k)    # ここは SQLAlchemy の ColumnElement
                    conditions.append(col == v)
            if conditions:
                stmt = stmt.where(*conditions)
            return session.exec(stmt).all()