import re
from phonemizer.backend import EspeakBackend
from phonemizer.phonemize import phonemize
from phonemizer.separator import Separator
import json
from .IPA.IPA_to_english import IPA_TO_EN
from kanjiconv import KanjiConv
from .to_IPA import text_to_ipa
import kanjiconv
from langdetect import detect



all_phonemes = list(IPA_TO_EN.keys())+  [':']
unique_phonemes = sorted(list(set(all_phonemes)), key=len, reverse=True)
phoneme_pattern = re.compile('|'.join(re.escape(p) for p in unique_phonemes))

conv = kanjiconv.KanjiConv()

def ipa_to_english(word_ipa:str)->str:
    phonemes = phoneme_pattern.findall(word_ipa)
    print(phonemes)
    katakana=""
    i = 0
    while i < len(phonemes):
        p = phonemes[i]
        if p == "kʲ" and i-1 <= len(phonemes):
            p_next = phonemes[i+1]
            if p_next == 'ä':katakana += "kyaau"
            if p_next == 'i':katakana += "kyeeu"
            if p_next == 'ɯᵝ':katakana += "kyuu"
            if p_next == 'e̞':katakana += "kyeyu"
            if p_next == 'o̞':katakana += "kyou"
            if p_next == 'ũ':katakana += "kyuu"
            i+=2
        else:
            katakana += IPA_TO_EN[p]
            i+=1
    return katakana

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

def japan_to_english(text: str) -> str:
    kanji_conv = KanjiConv(separator=" ")
    ans = []
    text_split = text.strip().split("\n")
    for t in text_split:
        if not t.strip():
            continue
        if detect(t) != "ja":
            ans.append({"original":t,"convert":"日本語を入力してね"})
            continue
        t_1=kanji_conv.to_hiragana(t)
        t_2=tokenize_japanese_simple(t)
        t_3=" ".join(t_2)
        words_ipa=text_to_ipa(t_1,"ja")        
        katakana_words = []
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue
            katakana=ipa_to_english(word_ipa)
            katakana_words.append(katakana)
        katakana_english = ' '.join(katakana_words)
        ans.append({"original":t_3,"convert":katakana_english})
    
    return ans

def korea_to_english(text: str) -> str:
    text_split = text.strip().split("\n")
    ans=[]
    for t in text_split:
        if not t.strip():
            continue
        if detect(t) != "ko":
            ans.append({"original":t,"convert":"한국어를 입력해 주세요"})
            continue
        words_ipa=text_to_ipa(t,"ko")
        print(words_ipa)        
        english_words = []
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue
            english=ipa_to_english(word_ipa)
            english_words.append(english)
        english_korea = ' '.join(english_words)
        ans.append({"original":t,"convert":english_korea})
    
    return ans



if __name__=="__main__":
    test_case="오늘 날씨가 좋네요"
    ans=korea_to_english(test_case)
    print(ans)