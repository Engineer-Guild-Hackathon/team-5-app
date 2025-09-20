from dotenv import load_dotenv
import os

# このファイルの場所を基準に、2階層上のディレクトリパスを取得
# (例: /project_root/)
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# .envファイルのフルパスを作成
dotenv_path = os.path.join(project_root, '.env')

# パスを指定して.envファイルを読み込む
load_dotenv(dotenv_path=dotenv_path)

# これで環境変数が読み込める
AMIVOICE_API_KEY = os.getenv("AMI_voice_APIkey")
AMIVOICE_URL=os.getenv("AMIVOICE_URL")
DATABASE_URL=os.getenv("DATABASE_URL")
MYSQL_ROOT_PASSWORD=os.getenv("MYSQL_ROOT_PASSWORD")
MYSQL_DATABASE=os.getenv("MYSQL_DATABASE")
MYSQL_USER=os.getenv("MYSQL_USER")
MYSQL_PASSWORD=os.getenv("MYSQL_PASSWORD")
