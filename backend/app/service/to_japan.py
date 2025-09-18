import re
from phonemizer.backend import EspeakBackend
from phonemizer.phonemize import phonemize
from phonemizer.separator import Separator
import json

from .IPA.IPA_to_japan import KANA_VOWEL_MAP,VOWELS,CONSONANTS,COMBINATIONS,DIPHTHONGS
from .to_IPA import text_to_ipa




all_phonemes = list(DIPHTHONGS.keys()) + list(CONSONANTS.keys()) + list(VOWELS.keys()) + [':']
unique_phonemes = sorted(list(set(all_phonemes)), key=len, reverse=True)
phoneme_pattern = re.compile('|'.join(re.escape(p) for p in unique_phonemes))

def to_full_width(text: str) -> str:
    """半角カタカナを全角カタカナに変換する"""
    return text.translate(str.maketrans(
        "ｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝﾞﾟ",
        "ァィゥェォャュョッーアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン゛゜"
    ))



def ipa_to_japan(word_ipa:list[str]) -> str:
    phonemes = phoneme_pattern.findall(word_ipa)
    i=0
    katakana=""
    while i < len(phonemes):
                p = phonemes[i]
                is_combination = False

                if (p in COMBINATIONS and i + 2 < len(phonemes) and
                    phonemes[i+1] == 'j' and phonemes[i+2] in VOWELS):
                    vowel_char = VOWELS[phonemes[i+2]][0]
                    if vowel_char == 'ｱ': katakana += COMBINATIONS[p]['i'] + 'ｬ'
                    elif vowel_char == 'ｳ': katakana += COMBINATIONS[p]['i'] + 'ｭ'
                    elif vowel_char == 'ｵ': katakana += COMBINATIONS[p]['i'] + 'ｮ'
                    else: katakana += COMBINATIONS[p]['i']
                    i += 3
                    is_combination = True
                elif p in COMBINATIONS and i + 1 < len(phonemes):
                    next_p = phonemes[i+1]
                    if next_p in VOWELS:
                        vowel_char = VOWELS[next_p][0]
                        if p == 's' and vowel_char == 'ｲ': katakana += 'ｼ'
                        elif p == 'z' and vowel_char == 'ｲ': katakana += 'ｼﾞ'
                        else:
                            lookup_key = KANA_VOWEL_MAP.get(vowel_char)
                            if lookup_key: katakana += COMBINATIONS[p][lookup_key]
                        i += 2
                        is_combination = True
                    elif next_p in DIPHTHONGS:
                        diph_kana = DIPHTHONGS[next_p]
                        first_vowel_char = diph_kana[0]
                        lookup_key = KANA_VOWEL_MAP.get(first_vowel_char)
                        if lookup_key:
                            katakana += COMBINATIONS[p][lookup_key] + diph_kana[1:]
                        i += 2
                        is_combination = True

                if is_combination:
                    continue

                if p == ':':
                    if katakana: katakana += 'ー'
                elif p in DIPHTHONGS:
                    katakana += DIPHTHONGS[p]
                elif p in VOWELS:
                    katakana += VOWELS[p]
                elif p in CONSONANTS:
                    # --- 【ロジック修正箇所】 ---
                    is_last_sound = (i == len(phonemes) - 1)
                    
                    # 例外: 'p', 't', 'k' が単語の末尾にある場合のみ 'ッ' にする
                    if p in ('p', 't', 'k') and is_last_sound:
                        katakana += 'ｯ'
                    # 例外: 'tʃ' が単語の末尾にある場合は 'ッチ'
                    elif p == 'tʃ' and is_last_sound:
                         katakana += 'ｯﾁ'
                    # 原則: それ以外の子音は、辞書の定義通りに変換する
                    else:
                        katakana += CONSONANTS[p]
                
                i += 1
    return katakana

def korea_to_japan(text:list[str])->str:
    ansewr=[]
    text_split = text.strip().split("\n")

    for t in text_split:
        if not t.strip():
            continue
        words_ipa=text_to_ipa(t,"ko")
        katakana_korea=""
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue
            katakana_korea+=" "
            katakana_korea+=ipa_to_japan(word_ipa)
        ansewr.append({"original":t,"convert":katakana_korea})
    
    return ansewr

def english_to_japan(text: str) -> str:
    ansewr=[]
    text_split = text.strip().split("\n")
    
    for t in text_split:
        if not t.strip():
            continue
        words_ipa=text_to_ipa(t)
        katakana_english=""
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue
            katakana_english+=" "
            katakana_english+=ipa_to_japan(word_ipa)
        ansewr.append({"original":t,"convert":katakana_english})
    
    return ansewr

# --- 実行 ---
if __name__ == '__main__':
    test_case = "안녕하세요 \n 맛있어요"
    print(f"--- Original ---\n{test_case}")
    katakana_json = korea_to_japan(test_case)
    print(f"--- Katakana (JSON) ---\n{katakana_json}")
    print("-" * 20)

