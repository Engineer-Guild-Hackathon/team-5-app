import re
from phonemizer.backend import EspeakBackend
from phonemizer.phonemize import phonemize
from phonemizer.separator import Separator
import json



def text_to_ipa(text: str, lang: str = 'en-us') -> list[str]:
    """
    1つのテキスト行を、単語ごとのIPA文字列のリストに変換する。
    例: "hello world" -> ["həloʊ", "wɜːld"]
    """
    if not text:
        return []
        
    ipa_string = phonemize(
        text, language=lang, backend='espeak', strip=True,
        preserve_punctuation=True, separator=Separator(word='|', phone='')
    )
    print(ipa_string)
    # 空の要素を除外して返す
    return [word.strip() for word in ipa_string.split('|') if word.strip()]

    