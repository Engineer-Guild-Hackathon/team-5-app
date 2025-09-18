import re
from phonemizer.backend import EspeakBackend
from phonemizer.phonemize import phonemize
from phonemizer.separator import Separator
import json
from .IPA.IPA_to_english import PHRASEBOOK_MAP,MAP
from kanjiconv import KanjiConv
from .to_IPA import text_to_ipa


all_phonemes = list(PHRASEBOOK_MAP.keys()) +  [':']
unique_phonemes = sorted(list(set(all_phonemes)), key=len, reverse=True)
phoneme_pattern = re.compile('|'.join(re.escape(p) for p in unique_phonemes))


def ipa_to_english(phonemes:list[str])->str:
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
    return katakana



def japan_to_english(text: str) -> str:
    kanji_conv = KanjiConv(separator=" ")
    ans = []
    text_split = text.strip().split("\n")
    for t in text_split:
        if not t.strip():
            continue
        t_1=kanji_conv.to_hiragana(t)
        words_ipa=text_to_ipa(t_1,"ja")        
        katakana_words = []
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue

            phonemes = phoneme_pattern.findall(word_ipa)
            print(phonemes)
            katakana=ipa_to_english(phonemes)
            katakana_words.append(katakana)
        katakana_english = ' '.join(katakana_words)
        ans.append({"original":t,"convert":katakana_english})
    
    return ans

def korea_to_english(text: str) -> str:
    text_split = text.strip().split("\n")
    ans=[]
    for t in text_split:
        if not t.strip():
            continue
        words_ipa=text_to_ipa(t,"ko")
        print(words_ipa)        
        english_words = []
        for word_ipa in words_ipa:
            word_ipa = word_ipa.strip()
            if not word_ipa:
                continue

            phonemes = phoneme_pattern.findall(word_ipa)
            print(phonemes)
            english=ipa_to_english(phonemes)
            english_words.append(english)
        english_korea = ' '.join(english_words)
        ans.append({"original":t,"convert":english_korea})
    
    return ans



if __name__=="__main__":
    test_case="안녕하세요\n안녕하세요"
    ans=korea_to_english(test_case)
    print(ans)