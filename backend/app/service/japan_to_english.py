import re
from phonemizer.backend import EspeakBackend
from phonemizer.phonemize import phonemize
from phonemizer.separator import Separator
import json
from kanjiconv import KanjiConv


MAP = {
    'a': 'aa', 'i': 'ee', 'u': 'oo', 'e': 'ey', 'o': 'oh',
    'b': 'b', 'd': 'd', 'g': 'g', 'h': 'w', 'k': 'k', 'm': 'm',
    'n': 'n', 'p': 'p', 'r': 'r', 's': 's', 't': 't', 'w': 'w',
    'y': 'y', 'z': 'z',
    'f': 'f', 'sh': 'sh', 'ch': 'ch', 'ts': 'tsoo', 'j': 'j',
    'N': 'n', 'pau': ' ', 'cl': ''
}

PHRASEBOOK_MAP = {
    # Vowels (母音)
    'ä': 'aa',   # 「あ」行の音
    'i': 'ee',   # 「い」行の音
    'ɯᵝ': 'u',  # 「う」行の音
    'e̞': 'ey',   # 「え」行の音
    'o̞': 'o',   # 「お」行の音
    'ũ': 'u',   # 鼻母音の「う」
    'b':'b',
    # Consonants (子音)
    'k': 'k',   # カ行
    's': 's',   # サ行
    'ɕ': 'sh',  # 「し」の音
    't': 't',   # タ行
    'tɕ': 'ch',  # 「ち」の音
    'ts': 'ts',  # 「つ」の音
    'n': 'n',   # ナ行
    'h': 'w',   # ハ行
    'ç': 'w',   # 「ひ」の音
    'ɸ': 'f',   # 「ふ」の音
    'm': 'm',   # マ行
    'j': 'y',   # ヤ行
    'ɽ': 'r',   # ラ行
    'w': 'w',   # ワ行
    'dʑ': 'j',  # 「じ」の音
    'g': 'g',
    'ɡ':'g',
    'z': 'z',
    'j': 'j',   # dʑ
    'd': 'd',
    'b': 'b',
    'kʲ':"ky",
    'ŋ':'n',

    # --- 追加：半濁音 ---
    'p': 'p',

    # --- 追加：特殊な拍の音 ---
    'ɴ': 'n',   # 撥音「ん」

    # (参考：pyopenjtalkで使われる他の記号)
    'cl': '',  # 促音「っ」 - 子音の重複で表現するため記号自体は不要
    'pau': ' ', # ポーズ（無音）
}

all_phonemes = list(PHRASEBOOK_MAP.keys()) +  [':']
unique_phonemes = sorted(list(set(all_phonemes)), key=len, reverse=True)
phoneme_pattern = re.compile('|'.join(re.escape(p) for p in unique_phonemes))

def japan_to_english(text: str) -> str:
    kanji_conv = KanjiConv(separator=" ")
    ans = []
    text_split = text.strip().split("\n")
    for t in text_split:
        if not t.strip():
            continue
        t_1=kanji_conv.to_hiragana(t)
        ipa = phonemize(
            t_1, language='ja', backend='espeak', strip=True,
            preserve_punctuation=True, separator=Separator(word='|', phone='')
        )
        words_ipa = ipa.split('|')
        print(words_ipa)
        
        katakana_words = []
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue

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
                    katakana += PHRASEBOOK_MAP[p]
                    i+=1
            katakana_words.append(katakana)
        
        katakana_english = ' '.join(katakana_words)
        ans.append({"original":t,"convert":katakana_english})
    
    return ans


if __name__== "__main__":
    test_case = "今日はいい天気ですね\n明日は雨が降るらしいです"
    print(f"--- Original ---\n{test_case}")
    katakana_json = japan_to_english(test_case)
    print(f"--- Katakana (JSON) ---\n{katakana_json}")
    print("-" * 20)
