#!/usr/bin/env python3
"""
Dictionary Generator (ETL) for Typing Game
生成輕量級的 dictionary.json 供打字遊戲使用

Data Sources:
- 倉頡: cin-tables/ov-cj-ext.cin (from OpenVanilla - 最乾淨的來源)
- 注音: cin-tables/bopomofo.cin (from chinese-opendesktop/cin-tables)
- 無蝦米: cin-tables/boshiamy.txt (from fcitx5-table-extra)
- 拼音: pypinyin library (Style.TONE3)

Output Format: Array of Arrays (minified JSON)
[char, zhuyin, cangjie, boshiamy, pinyin]
"""

import json
import os
from pypinyin import pinyin, Style

# ========================================
# 檔案路徑設定
# ========================================
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CIN_DIR = os.path.join(SCRIPT_DIR, "cin-tables")

# 資料來源優先順序
CANGJIE_FILES = [
    os.path.join(CIN_DIR, "ov-cj-ext.cin"),  # OpenVanilla (優先)
    os.path.join(CIN_DIR, "cj5.cin"),         # chinese-opendesktop 備用
]
BOPOMOFO_FILE = os.path.join(CIN_DIR, "bopomofo.cin")
BOSHIAMY_FILE = os.path.join(CIN_DIR, "boshiamy.txt")  # Fcitx5 格式

OUTPUT_FILE = os.path.join(SCRIPT_DIR, "dictionary.json")

# ========================================
# 鍵盤碼到注音符號對照表
# 這個對照表來自 bopomofo.cin 的 %keyname 區塊
# ========================================
KEYBOARD_TO_ZHUYIN = {
    ',': 'ㄝ', '-': 'ㄦ', '.': 'ㄡ', '/': 'ㄥ',
    '0': 'ㄢ', '1': 'ㄅ', '2': 'ㄉ', '3': 'ˇ',
    '4': 'ˋ', '5': 'ㄓ', '6': 'ˊ', '7': '˙',
    '8': 'ㄚ', '9': 'ㄞ', ';': 'ㄤ',
    'a': 'ㄇ', 'b': 'ㄖ', 'c': 'ㄏ', 'd': 'ㄎ',
    'e': 'ㄍ', 'f': 'ㄑ', 'g': 'ㄕ', 'h': 'ㄘ',
    'i': 'ㄛ', 'j': 'ㄨ', 'k': 'ㄜ', 'l': 'ㄠ',
    'm': 'ㄩ', 'n': 'ㄙ', 'o': 'ㄟ', 'p': 'ㄣ',
    'q': 'ㄆ', 'r': 'ㄐ', 's': 'ㄋ', 't': 'ㄔ',
    'u': 'ㄧ', 'v': 'ㄒ', 'w': 'ㄊ', 'x': 'ㄌ',
    'y': 'ㄗ', 'z': 'ㄈ',
}

# 倉頡字母對照表 (用於顯示)
CANGJIE_MAP = {
    'a': '日', 'b': '月', 'c': '金', 'd': '木', 'e': '水',
    'f': '火', 'g': '土', 'h': '竹', 'i': '戈', 'j': '十',
    'k': '大', 'l': '中', 'm': '一', 'n': '弓', 'o': '人',
    'p': '心', 'q': '手', 'r': '口', 's': '尸', 't': '廿',
    'u': '山', 'v': '女', 'w': '田', 'x': '難', 'y': '卜',
    'z': '重',
}


def keyboard_to_zhuyin(keyboard_code: str) -> str:
    """將鍵盤碼轉換為注音符號"""
    result = []
    for char in keyboard_code:
        if char in KEYBOARD_TO_ZHUYIN:
            result.append(KEYBOARD_TO_ZHUYIN[char])
        else:
            result.append(char)  # 未知字符保留原樣
    return ''.join(result)


def cangjie_to_display(code: str) -> str:
    """將倉頡字母碼轉換為中文字根顯示"""
    result = []
    for char in code.lower():
        if char in CANGJIE_MAP:
            result.append(CANGJIE_MAP[char])
        else:
            result.append(char)
    return ''.join(result)


def is_big5_compatible(char: str) -> bool:
    """
    Rule A: Big5 Filtering
    檢查字元是否存在於 Big5 編碼標準中。
    """
    try:
        char.encode('big5')
        return True
    except UnicodeEncodeError:
        return False


def is_cjk_character(char: str) -> bool:
    """
    檢查字元是否為 CJK 漢字（中日韓統一表意文字）
    只取基本區和擴展A，涵蓋絕大多數常用漢字。
    """
    code = ord(char)
    # CJK Unified Ideographs (基本區)
    if 0x4E00 <= code <= 0x9FFF:
        return True
    # CJK Unified Ideographs Extension A
    if 0x3400 <= code <= 0x4DBF:
        return True
    return False


def parse_cin_file(filepath: str) -> dict:
    """
    解析 .cin 格式的輸入法檔案 (OpenVanilla / chinese-opendesktop 格式)
    
    .cin 格式：
    - %chardef begin ... %chardef end 之間為字碼定義
    - 每行格式: code char
    """
    char_codes = {}
    in_chardef = False
    
    if not os.path.exists(filepath):
        print(f"    [Warning] File not found: {os.path.basename(filepath)}")
        return char_codes
    
    print(f"  Parsing: {os.path.basename(filepath)}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            
            if line == '%chardef begin':
                in_chardef = True
                continue
            if line == '%chardef end':
                in_chardef = False
                continue
            
            if not in_chardef:
                continue
            if not line or line.startswith('#'):
                continue
            
            parts = line.split(maxsplit=1)
            if len(parts) >= 2:
                code = parts[0]
                char = parts[1]
                if len(char) == 1:
                    if char not in char_codes:
                        char_codes[char] = []
                    char_codes[char].append(code)
    
    print(f"    Found {len(char_codes)} unique characters")
    return char_codes


def parse_fcitx_table(filepath: str) -> dict:
    """
    解析 Fcitx5 table 格式的無蝦米檔案 (boshiamy.txt)
    
    Fcitx5 格式：
    - [数据] 或 [資料] 之後為字碼定義
    - 每行格式: code char (code 在前，char 在後)
    """
    char_codes = {}
    in_data = False
    
    if not os.path.exists(filepath):
        print(f"    [Warning] File not found: {os.path.basename(filepath)}")
        return char_codes
    
    print(f"  Parsing: {os.path.basename(filepath)}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            
            # 進入資料區塊
            if line in ['[数据]', '[資料]', '[Data]']:
                in_data = True
                continue
            
            # 離開資料區塊（遇到其他區塊標記）
            if line.startswith('[') and line.endswith(']'):
                in_data = False
                continue
            
            if not in_data:
                continue
            if not line or line.startswith('#'):
                continue
            
            parts = line.split(maxsplit=1)
            if len(parts) >= 2:
                code = parts[0]
                char = parts[1]
                # 只取單一字元
                if len(char) == 1:
                    if char not in char_codes:
                        char_codes[char] = []
                    char_codes[char].append(code)
    
    print(f"    Found {len(char_codes)} unique characters")
    return char_codes


def get_shortest_code(codes: list) -> str:
    """
    Rule B: Collision Handling (Shortest Code Wins)
    當一個字有多個輸入碼時，選擇最短的那個。
    """
    if not codes:
        return ""
    return min(codes, key=len)


def get_pinyin_with_tone(char: str) -> str:
    """
    使用 pypinyin 取得拼音（Style.TONE3 = 數字聲調，如 guang3）
    """
    try:
        result = pinyin(char, style=Style.TONE3)
        if result and result[0]:
            return result[0][0]
    except Exception:
        pass
    return ""


def find_first_existing_file(file_list: list) -> str:
    """從檔案列表中找到第一個存在的檔案"""
    for f in file_list:
        if os.path.exists(f):
            return f
    return None


def build_dictionary() -> list:
    """
    主要 ETL 流程：建構字典
    """
    print("\n[Step 1] Parsing input method tables")
    
    # 找到倉頡碼表（優先使用 OpenVanilla）
    cangjie_file = find_first_existing_file(CANGJIE_FILES)
    if cangjie_file:
        cj_data = parse_cin_file(cangjie_file)
    else:
        print("  [ERROR] No Cangjie table found!")
        cj_data = {}
    
    # 注音碼表
    zhuyin_data = parse_cin_file(BOPOMOFO_FILE)
    
    # 無蝦米碼表 (Fcitx5 格式)
    boshiamy_data = parse_fcitx_table(BOSHIAMY_FILE)
    
    # 收集所有字元
    all_chars = set(cj_data.keys()) | set(zhuyin_data.keys()) | set(boshiamy_data.keys())
    
    print(f"\n[Step 2] Building dictionary")
    print(f"  Total unique characters: {len(all_chars)}")
    
    # 建構字典
    dictionary = []
    non_cjk_count = 0
    non_big5_count = 0
    
    for char in sorted(all_chars):
        # 檢查是否為 CJK 漢字
        if not is_cjk_character(char):
            non_cjk_count += 1
            continue
        
        # Rule A: Big5 過濾
        if not is_big5_compatible(char):
            non_big5_count += 1
            continue
        
        # Rule B: 取最短碼
        # 倉頡
        cj_codes = cj_data.get(char, [])
        cangjie_raw = get_shortest_code(cj_codes)
        cangjie = cangjie_to_display(cangjie_raw)
        
        # 注音
        zy_codes = zhuyin_data.get(char, [])
        zhuyin_raw = get_shortest_code(zy_codes)
        zhuyin = keyboard_to_zhuyin(zhuyin_raw)
        
        # 無蝦米
        bs_codes = boshiamy_data.get(char, [])
        boshiamy = get_shortest_code(bs_codes).upper()  # 無蝦米通常大寫顯示
        
        # 拼音 (TONE3 格式)
        pinyin_str = get_pinyin_with_tone(char)
        
        # Rule C: 組合各欄位
        entry = [char, zhuyin, cangjie, boshiamy, pinyin_str]
        dictionary.append(entry)
    
    print(f"\n[Step 3] Filtering results")
    print(f"  Non-CJK characters filtered: {non_cjk_count}")
    print(f"  Non-Big5 characters filtered: {non_big5_count}")
    print(f"  Characters in final dictionary: {len(dictionary)}")
    
    # 統計覆蓋率
    chars_with_zhuyin = sum(1 for e in dictionary if e[1])
    chars_with_cangjie = sum(1 for e in dictionary if e[2])
    chars_with_boshiamy = sum(1 for e in dictionary if e[3])
    chars_with_pinyin = sum(1 for e in dictionary if e[4])
    
    print(f"\n[Step 4] Coverage statistics")
    print(f"  With Zhuyin:   {chars_with_zhuyin:,} ({chars_with_zhuyin*100/len(dictionary):.1f}%)")
    print(f"  With Cangjie:  {chars_with_cangjie:,} ({chars_with_cangjie*100/len(dictionary):.1f}%)")
    print(f"  With Boshiamy: {chars_with_boshiamy:,} ({chars_with_boshiamy*100/len(dictionary):.1f}%)")
    print(f"  With Pinyin:   {chars_with_pinyin:,} ({chars_with_pinyin*100/len(dictionary):.1f}%)")
    
    return dictionary


def save_dictionary(dictionary: list, filepath: str):
    """將字典儲存為 Minified JSON"""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(dictionary, f, ensure_ascii=False, separators=(',', ':'))
    
    size = os.path.getsize(filepath)
    print(f"\n[Output]")
    print(f"  Saved to: {filepath}")
    print(f"  File size: {size:,} bytes ({size/1024:.1f} KB)")


def main():
    """主程式進入點"""
    print("=" * 60)
    print("Dictionary Generator (ETL) for Typing Game")
    print("=" * 60)
    
    # 建構字典
    dictionary = build_dictionary()
    
    # 儲存為 JSON
    save_dictionary(dictionary, OUTPUT_FILE)
    
    # 顯示範例輸出
    print("\n[Sample Output] (first 20 entries)")
    print("-" * 70)
    print(f"{'Char':<4} {'Zhuyin':<8} {'Cangjie':<10} {'Boshiamy':<8} {'Pinyin':<8}")
    print("-" * 70)
    for entry in dictionary[:20]:
        char, zy, cj, bs, py = entry
        print(f"{char:<4} {zy:<8} {cj:<10} {bs:<8} {py:<8}")


if __name__ == "__main__":
    main()
