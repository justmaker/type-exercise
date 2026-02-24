import unittest
import sys
import os
from unittest.mock import patch, mock_open, MagicMock

# Mock pypinyin before importing build_dict
mock_pypinyin = MagicMock()
sys.modules["pypinyin"] = mock_pypinyin
mock_pypinyin.Style = MagicMock()

import build_dict

class TestBuildDict(unittest.TestCase):
    def test_keyboard_to_zhuyin(self):
        self.assertEqual(build_dict.keyboard_to_zhuyin("1qaz"), "ㄅㄆㄇㄈ")
        self.assertEqual(build_dict.keyboard_to_zhuyin("u j03"), "ㄧ ㄨㄢˇ")
        self.assertEqual(build_dict.keyboard_to_zhuyin("1234"), "ㄅㄉˇˋ")
        self.assertEqual(build_dict.keyboard_to_zhuyin("!@#$"), "!@#$")

    def test_cangjie_to_display(self):
        self.assertEqual(build_dict.cangjie_to_display("a"), "日")
        self.assertEqual(build_dict.cangjie_to_display("abc"), "日月金")
        self.assertEqual(build_dict.cangjie_to_display("xyz"), "難卜重")
        self.assertEqual(build_dict.cangjie_to_display("123"), "123")

    def test_is_big5_compatible(self):
        self.assertTrue(build_dict.is_big5_compatible("中"))
        self.assertTrue(build_dict.is_big5_compatible("A"))
        # 𠮷 is U+20BB7, which is not in Big5
        self.assertFalse(build_dict.is_big5_compatible("𠮷"))

    def test_is_cjk_character(self):
        self.assertTrue(build_dict.is_cjk_character("中"))  # Basic
        self.assertTrue(build_dict.is_cjk_character("\u3400")) # Ext A start
        self.assertTrue(build_dict.is_cjk_character("\u4DBF")) # Ext A end
        self.assertFalse(build_dict.is_cjk_character("A"))
        self.assertFalse(build_dict.is_cjk_character("1"))
        self.assertFalse(build_dict.is_cjk_character("，"))
        self.assertFalse(build_dict.is_cjk_character("ㄔ"))

    def test_get_shortest_code(self):
        self.assertEqual(build_dict.get_shortest_code(["abc", "a", "ab"]), "a")
        self.assertEqual(build_dict.get_shortest_code([]), "")

    def test_get_pinyin_with_tone(self):
        build_dict.pinyin.return_value = [["guang3"]]
        self.assertEqual(build_dict.get_pinyin_with_tone("廣"), "guang3")
        build_dict.pinyin.assert_called_with("廣", style=build_dict.Style.TONE3)

        build_dict.pinyin.return_value = []
        self.assertEqual(build_dict.get_pinyin_with_tone("?"), "")

    def test_parse_cin_file(self):
        cin_content = """
%chardef begin
a 中
ab 大
a 小
%chardef end
"""
        with patch("builtins.open", mock_open(read_data=cin_content)):
            with patch("os.path.exists", return_value=True):
                result = build_dict.parse_cin_file("dummy.cin")
                self.assertEqual(result["中"], ["a"])
                self.assertEqual(result["大"], ["ab"])
                self.assertEqual(result["小"], ["a"])

    def test_parse_fcitx_table(self):
        fcitx_content = """
[数据]
a 中
ab 大
# comment
[其他]
xyz 沒
"""
        with patch("builtins.open", mock_open(read_data=fcitx_content)):
            with patch("os.path.exists", return_value=True):
                result = build_dict.parse_fcitx_table("dummy.txt")
                self.assertEqual(result["中"], ["a"])
                self.assertEqual(result["大"], ["ab"])
                self.assertNotIn("沒", result)

    def test_find_first_existing_file(self):
        with patch("os.path.exists") as mock_exists:
            mock_exists.side_effect = [False, True]
            files = ["file1", "file2", "file3"]
            self.assertEqual(build_dict.find_first_existing_file(files), "file2")

            mock_exists.side_effect = [False, False, False]
            self.assertIsNone(build_dict.find_first_existing_file(files))

if __name__ == "__main__":
    unittest.main()
