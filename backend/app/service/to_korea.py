import re
from phonemizer.backend import EspeakBackend
from phonemizer.phonemize import phonemize
from phonemizer.separator import Separator
import json
from .IPA.IPA_to_korea import VOWELS_IPA_TO_KR,CONSONANTS_IPA_TO_KR,DIPHTHONGS_IPA_TO_KR,COMBINATIONS_IPA_TO_KR
from .to_IPA import text_to_ipa
from kanjiconv import KanjiConv
import kanjiconv
from langdetect import detect
all_phonemes = list(VOWELS_IPA_TO_KR.keys()) + list(CONSONANTS_IPA_TO_KR.keys()) + list(DIPHTHONGS_IPA_TO_KR.keys()) + list(COMBINATIONS_IPA_TO_KR.keys()) + [':']
unique_phonemes = sorted(list(set(all_phonemes)), key=len, reverse=True)
phoneme_pattern = re.compile('|'.join(re.escape(p) for p in unique_phonemes))


def ipa_to_korea(word_ipa: str) -> str:
    """
    1単語分のIPA文字列をハングルに変換する。
    例: "həloʊ" -> "헬오우" (近似)
    """
    # IPA文字列を音素のリストに分割
    phonemes = phoneme_pattern.findall(word_ipa)
    
    hangul = ""
    i = 0
    while i < len(phonemes):
        p = phonemes[i]
        
        # パターン1: 子音 + 母音 or 子音 + 二重母音 の組み合わせ
        if p in COMBINATIONS_IPA_TO_KR and i + 1 < len(phonemes):
            next_p = phonemes[i+1]
            
            # COMBINATIONS辞書に '子音IPA + 母音IPA' の組み合わせが存在するかチェック
            if next_p in COMBINATIONS_IPA_TO_KR[p]:
                hangul += COMBINATIONS_IPA_TO_KR[p][next_p]
                i += 2  # 2つの音素を処理したのでインデックスを2進める
                continue # この音素の処理は完了、次のループへ
        
        # パターン2: 上記の組み合わせに当てはまらない単独の音素
        if p in DIPHTHONGS_IPA_TO_KR:
            hangul += DIPHTHONGS_IPA_TO_KR[p]
        elif p in VOWELS_IPA_TO_KR:
            hangul += VOWELS_IPA_TO_KR[p]
        elif p in CONSONANTS_IPA_TO_KR:
            # カタカナと違い、ハングルでは末尾の子音をパッチムとして表現できるが、
            # このルールベースでは単純化のため、基本の音節(子音+으)を追加する
            hangul += CONSONANTS_IPA_TO_KR[p]
        
        i += 1
        
    return hangul

def tokenize_japanese_simple(original_text: str) -> list[str]:
    """
    kanjiconvの内部辞書による分かち書き機能を利用して、
    日本語の文章を単語に分割する。

    Args:
        original_text (str): 漢字などを含む元の文章。

    Returns:
        list[str]: 元の文章を単語分割したリスト。
    """
    if not original_text:
        return []

    # 1. kanjiconvのインスタンスを、スペースを区切り文字として作成
    conv = kanjiconv.KanjiConv(separator=" ")
    
    # 2. to_hiraganaを呼び出すと、単語間にスペースが入ったひらがな文字列が返る
    # 例: "にほんご の ぶんしょう ..."
    space_separated_hiragana = conv.to_hiragana(original_text)
    
    # 3. スペースで分割し、ひらがなの単語リスト（お手本）を作成
    hiragana_tokens = space_separated_hiragana.split(' ')

    # 4. 以前作成したロジックで、お手本を基に元の文章を分割する
    result_tokens = []
    original_index = 0
    
    for h_token in hiragana_tokens:
        h_token_len = len(h_token)
        current_hiragana_len = 0
        start_index = original_index
        
        while original_index < len(original_text) and current_hiragana_len < h_token_len:
            original_char = original_text[original_index]
            hiragana_reading = conv.to_hiragana(original_char)
            current_hiragana_len += len(hiragana_reading)
            original_index += 1
            
        original_token = original_text[start_index:original_index]
        result_tokens.append(original_token)

    return result_tokens


def english_to_korea(text: str) -> str:
    ansewr=[]
    text_split = text.strip().split("\n")
    
    for t in text_split:
        if not t.strip():
            continue
        if detect(t) == "ja" or detect(t) == "ko":
            ansewr.append({"original":t,"convert":"Please enter English"})
            continue
        words_ipa=text_to_ipa(t)
        korea_english=""
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue
            korea_english+=" "
            korea_english+=ipa_to_korea(word_ipa)
        ansewr.append({"original":t,"convert":korea_english})
    
    return ansewr

def japan_to_korea(text:str)->str:
    ansewr=[]
    text_split = text.strip().split("\n")
    kanji_conv = KanjiConv(separator=" ")
    
    for t in text_split:
        if not t.strip():
            continue
        if detect(t) != "ja":
            ansewr.append({"original":t,"convert":"日本語を入力してね"})
            continue
        t_1=kanji_conv.to_hiragana(t)
        t_2=tokenize_japanese_simple(t)
        t_3=" ".join(t_2)
        words_ipa=text_to_ipa(t_1,"ja")
        korea_japan=""
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue
            korea_japan+=" "
            korea_japan+=ipa_to_korea(word_ipa)
        ansewr.append({"original":t_3,"convert":korea_japan})
    
    return ansewr

if __name__ == '__main__':
    test_case = "今日はいい天気ですね"
    print(f"--- Original ---\n{test_case}")
    katakana_json = japan_to_korea(test_case)
    print(f"--- Katakana (JSON) ---\n{katakana_json}")
    print("-" * 20)