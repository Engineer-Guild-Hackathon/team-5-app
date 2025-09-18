from sqlmodel import create_engine, Session,SQLModel
# config.pyからDATABASE_URLをインポート
from ..core.config import DATABASE_URL
from .models import User

# データベース接続エンジンを作成
# このエンジンが、アプリケーション全体でデータベースとの接続を管理します
engine = create_engine(DATABASE_URL, echo=True) # echo=Trueで実行されるSQLが見える

def create_db_and_tables():
    """
    SQLModelで定義された全てのテーブルをデータベースに作成する関数。
    テーブルが既に存在する場合は、何も起こらない。
    """
    print("データベースとテーブルを作成します...")
    SQLModel.metadata.create_all(engine)
    print("データベースとテーブルの準備が完了しました。")

def get_db():
    """
    APIリクエストのたびに呼び出される依存性注入（Dependency）用の関数。
    データベースセッションを開始し、処理が終わったら必ず閉じる。
    """
    with Session(engine) as session:
        yield session