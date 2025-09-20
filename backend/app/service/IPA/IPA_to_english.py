# ==============================================================================
# IPA (国際音声記号) から英語のスペルへの変換辞書 (近似)
# ==============================================================================

# 母音
IPA_TO_EN = {
    # IPA : English Spelling (Approximation)
    'æ': 'aa',   # cat
    'a': 'aa',   # father
    'ə': 'ae',   # about (schwa)
    'ʌ': 'u',   # cut
    'e': 'ey',
    'ɛ': 'e',   # met
    'i': 'ee',
    'ɪ': 'ee',   # fit
    'iː': 'ee',  # see
    'o': 'oh',
    'ɔ': 'o',   # caught
    'u': 'uu',
    'ũ':'n',
    'ʊ': 'uu',  # book
    'uː': 'uu',  # blue
    'ɚ': 'er',  # teacher
    'ɝ': 'ur',  # bird
    'ɜː': 'ur',  # bird
    'ɐ': 'u',
    'ɽ':'r',
    'ɑː': 'aa',  # father
    'ɯ': 'u',
    'q': 'q',
    "ɕ":"sy",
    # IPA : English Spelling (Approximation)
    'b': 'b', 'd': 'd', 'f': 'f', 'ɡ': 'g', 'h': 'w', 'k': 'k',
    'l': 'l', 'm': 'm', 'n': 'n', 'p': 'p', 's': 's', 't': 't',
    'v': 'v', 'w': 'w', 'j': 'y', 'z': 'z', 'ʃ': 'sh', 'θ': 'th',
    'ð': 'th', 'ŋ': 'ng', 'ɹ': 'r', 'tʃ': 'ch', 'dʒ': 'j', 'ʒ': 's',
    '?': '?', 'ɫ': 'l',
    # IPA : English Spelling (Approximation)
    'aɪ': 'igh',  # my, high
    'aʊ': 'ow',   # how, cow
    'eɪ': 'ay',   # say, day
    'oʊ': 'o',    # boat, go
    'ɔɪ': 'oy',    # boy, toy
    "ä":"aa",
    "ɯᵝ":"uu",
    "e̞":"ey",
    "o̞":"ou",
    "ũ:":"uu",
    "kʲ":"ky"
}
# フレーズブック（特定の単語の強制変換）
PHRASEBOOK_EN = {
}

