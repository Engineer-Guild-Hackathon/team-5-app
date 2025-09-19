import re
from phonemizer.backend import EspeakBackend
from phonemizer.phonemize import phonemize
from phonemizer.separator import Separator
import json

from .IPA.IPA_to_japan import KANA_VOWEL_MAP,VOWELS,CONSONANTS,COMBINATIONS,DIPHTHONGS,PHRASEBOOK
from .to_IPA import text_to_ipa
from langdetect import detect




all_phonemes = list(DIPHTHONGS.keys()) + list(CONSONANTS.keys()) + list(VOWELS.keys()) + list(COMBINATIONS.keys())+list(PHRASEBOOK.keys())+ [':']
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
    print(phonemes)
    i=0
    katakana=""
    while i < len(phonemes):
                p = phonemes[i]
                is_combination = False
                if p in PHRASEBOOK:
                    katakana+=PHRASEBOOK[p]
                if p in COMBINATIONS and i + 1 < len(phonemes):
                    next_p = phonemes[i+1]
                    # COMBINATIONS辞書に '子音+母音' の組み合わせが存在するか直接チェック
                    if next_p in COMBINATIONS[p]:
                        katakana += COMBINATIONS[p][next_p]
                        i += 2  # 2つの音素を処理したのでインデックスを2進める
                        continue # この音素の処理は完了、次のループへ
        

                if (p in COMBINATIONS and i + 2 < len(phonemes) and
                    phonemes[i+1] == 'j' and phonemes[i+2] in VOWELS):
                    vowel_char = VOWELS[phonemes[i+2]]
                    if vowel_char == 'ｱ': katakana += COMBINATIONS[p]['i'] + 'ｬ'
                    elif vowel_char == 'ｳ': katakana += COMBINATIONS[p]['i'] + 'ｭ'
                    elif vowel_char == 'ｵ': katakana += COMBINATIONS[p]['i'] + 'ｮ'
                    else: katakana += COMBINATIONS[p]['i']
                    i += 3
                    is_combination = True
                elif p in COMBINATIONS and i + 1 < len(phonemes):
                    next_p = phonemes[i+1]
                    if next_p in VOWELS:
                        vowel_char = VOWELS[next_p]
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
        if detect(t) != "ko":
            ansewr.append({"original":t,"convert":"한국어를　입력해　주세요"})
            continue
        words_ipa=text_to_ipa(t,"ko")
        katakana_korea=""
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue
            katakana_korea+=ipa_to_japan(word_ipa)
            katakana_korea+=" "
        ansewr.append({"original":t,"convert":katakana_korea})
    
    return ansewr

def english_to_japan(text: str) -> str:
    ansewr=[]
    text_split = text.strip().split("\n")
    
    for t in text_split:
        if not t.strip():
            continue
        if detect(t) == "ja" or detect(t) == "ko":
            ansewr.append({"original":t,"convert":"please　enter　English"})
            continue
        words_ipa=text_to_ipa(t)
               # --- ▼ ここから連音化処理 ▼ ---
        
        # 2. IPAを phoneme のリストに変換 (より正確な判定のため)
        words_phonemes = [phoneme_pattern.findall(w) for w in words_ipa]

        # 3. 隣接単語をチェックし、連音化ルールを適用
        i = 0
        while i < len(words_phonemes) - 1:
            current_phonemes = words_phonemes[i]
            next_phonemes = words_phonemes[i+1]
            
            # リストが空でないことを確認
            if not current_phonemes or not next_phonemes:
                i += 1
                continue

            last_phoneme = current_phonemes[-1]
            first_phoneme = next_phonemes[0]
            
            # ルール1: ...d + j...  ->  ...dʒ... (例: did you)
            if last_phoneme == 'd' and first_phoneme == 'j':
                current_phonemes.pop() # 最後の 'd' を削除
                next_phonemes[0] = 'dʒ'  # 先頭の 'j' を 'dʒ' に変更
            
            # ルール2: ...k + j...  ->  ...kʲ... (例: thank you)
            elif last_phoneme == 'k' and first_phoneme == 'j':
                current_phonemes.pop()
                # 'kʲ' は特殊な記号なので、ipa_to_japan側で処理できるか確認が必要
                next_phonemes[0] = 'kʲ'
            
            # ルール3: ...t + j...  ->  ...tʃ... (例: want you)
            elif last_phoneme == 't' and first_phoneme == 'j':
                current_phonemes.pop()
                next_phonemes[0] = 'tʃ'

            elif last_phoneme == "m" and first_phoneme =="ɐ":
                current_phonemes.pop()
                next_phonemes[0] = "mɐ"

            i += 1

        # 4. phonemeリストを再びIPA文字列のリストに戻す
        processed_words_ipa = ["".join(p_list) for p_list in words_phonemes]
        
        katakana_english=""
        print(processed_words_ipa)
        for word_ipa in processed_words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue
            katakana_english+=ipa_to_japan(word_ipa)
            katakana_english+=" "
        ansewr.append({"original":t,"convert":katakana_english})
    
    return ansewr

# --- 実行 ---
if __name__ == '__main__':
    test_case="오늘 날씨가 좋네요\n만나서 반갑습니다\n이름이 뭐예요?\n감사합니다\n이것은 얼마예요?"
    print(f"--- Original ---\n{test_case}")
    katakana_json = korea_to_japan(test_case)
    print(f"--- Katakana (JSON) ---\n{katakana_json}")
    print("-" * 20)

