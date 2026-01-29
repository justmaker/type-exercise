// 中文字編碼資料 - 擴充版（約 500 常用字）
const encodingData = {
    // ===== 最常用字 =====
    '的': { zhuyin: 'ㄉㄜ˙', cangjie: '竹日弓', boshiamy: 'PI', pinyin: 'de' },
    '一': { zhuyin: 'ㄧ', cangjie: '一', boshiamy: 'M', pinyin: 'yī' },
    '是': { zhuyin: 'ㄕˋ', cangjie: '日一卜人', boshiamy: 'AMYO', pinyin: 'shì' },
    '不': { zhuyin: 'ㄅㄨˋ', cangjie: '一火', boshiamy: 'MF', pinyin: 'bù' },
    '了': { zhuyin: 'ㄌㄜ˙', cangjie: '弓弓', boshiamy: 'NN', pinyin: 'le' },
    '在': { zhuyin: 'ㄗㄞˋ', cangjie: '大土', boshiamy: 'KG', pinyin: 'zài' },
    '人': { zhuyin: 'ㄖㄣˊ', cangjie: '人', boshiamy: 'O', pinyin: 'rén' },
    '有': { zhuyin: 'ㄧㄡˇ', cangjie: '大月', boshiamy: 'KB', pinyin: 'yǒu' },
    '我': { zhuyin: 'ㄨㄛˇ', cangjie: '竹手戈', boshiamy: 'HQI', pinyin: 'wǒ' },
    '他': { zhuyin: 'ㄊㄚ', cangjie: '人心', boshiamy: 'OP', pinyin: 'tā' },
    '這': { zhuyin: 'ㄓㄜˋ', cangjie: '卜口一弓', boshiamy: 'YRMN', pinyin: 'zhè' },
    '個': { zhuyin: 'ㄍㄜˋ', cangjie: '人口竹口', boshiamy: 'ORHR', pinyin: 'gè' },
    '們': { zhuyin: 'ㄇㄣ˙', cangjie: '人日弓', boshiamy: 'OAN', pinyin: 'men' },
    '中': { zhuyin: 'ㄓㄨㄥ', cangjie: '中', boshiamy: 'L', pinyin: 'zhōng' },
    '來': { zhuyin: 'ㄌㄞˊ', cangjie: '木人人', boshiamy: 'DOO', pinyin: 'lái' },
    '上': { zhuyin: 'ㄕㄤˋ', cangjie: '卜一', boshiamy: 'YM', pinyin: 'shàng' },
    '大': { zhuyin: 'ㄉㄚˋ', cangjie: '大', boshiamy: 'K', pinyin: 'dà' },
    '為': { zhuyin: 'ㄨㄟˋ', cangjie: '戈大弓火', boshiamy: 'IKNF', pinyin: 'wèi' },
    '和': { zhuyin: 'ㄏㄜˊ', cangjie: '竹木口', boshiamy: 'HDR', pinyin: 'hé' },
    '國': { zhuyin: 'ㄍㄨㄛˊ', cangjie: '田戈口一', boshiamy: 'WIRM', pinyin: 'guó' },
    '地': { zhuyin: 'ㄉㄧˋ', cangjie: '土心木', boshiamy: 'GPD', pinyin: 'dì' },
    '到': { zhuyin: 'ㄉㄠˋ', cangjie: '一土中弓', boshiamy: 'MGLN', pinyin: 'dào' },
    '以': { zhuyin: 'ㄧˇ', cangjie: '女戈人', boshiamy: 'VIO', pinyin: 'yǐ' },
    '說': { zhuyin: 'ㄕㄨㄛ', cangjie: '卜口金口', boshiamy: 'YRCR', pinyin: 'shuō' },
    '時': { zhuyin: 'ㄕˊ', cangjie: '日土戈', boshiamy: 'AGI', pinyin: 'shí' },
    '要': { zhuyin: 'ㄧㄠˋ', cangjie: '一女火', boshiamy: 'MVF', pinyin: 'yào' },
    '就': { zhuyin: 'ㄐㄧㄡˋ', cangjie: '卜火大', boshiamy: 'YFK', pinyin: 'jiù' },
    '出': { zhuyin: 'ㄔㄨ', cangjie: '山山', boshiamy: 'UU', pinyin: 'chū' },
    '會': { zhuyin: 'ㄏㄨㄟˋ', cangjie: '人一日火', boshiamy: 'OMAF', pinyin: 'huì' },
    '可': { zhuyin: 'ㄎㄜˇ', cangjie: '一弓口', boshiamy: 'MNR', pinyin: 'kě' },
    '也': { zhuyin: 'ㄧㄝˇ', cangjie: '心木', boshiamy: 'PD', pinyin: 'yě' },
    '你': { zhuyin: 'ㄋㄧˇ', cangjie: '人弓火', boshiamy: 'ONF', pinyin: 'nǐ' },
    '對': { zhuyin: 'ㄉㄨㄟˋ', cangjie: '土口木戈', boshiamy: 'GRDI', pinyin: 'duì' },
    '生': { zhuyin: 'ㄕㄥ', cangjie: '竹手一', boshiamy: 'HQM', pinyin: 'shēng' },
    '能': { zhuyin: 'ㄋㄥˊ', cangjie: '戈月心心', boshiamy: 'IBPP', pinyin: 'néng' },
    '而': { zhuyin: 'ㄦˊ', cangjie: '一月中中', boshiamy: 'MBLL', pinyin: 'ér' },
    '子': { zhuyin: 'ㄗˇ', cangjie: '弓木', boshiamy: 'ND', pinyin: 'zǐ' },
    '那': { zhuyin: 'ㄋㄚˋ', cangjie: '尸手中', boshiamy: 'SQL', pinyin: 'nà' },
    '得': { zhuyin: 'ㄉㄜˊ', cangjie: '竹人日一', boshiamy: 'HOAM', pinyin: 'dé' },
    '於': { zhuyin: 'ㄩˊ', cangjie: '卜尸人', boshiamy: 'YSO', pinyin: 'yú' },
    '著': { zhuyin: 'ㄓㄜ˙', cangjie: '廿月十', boshiamy: 'TBJ', pinyin: 'zhe' },
    '下': { zhuyin: 'ㄒㄧㄚˋ', cangjie: '一卜', boshiamy: 'MY', pinyin: 'xià' },
    '自': { zhuyin: 'ㄗˋ', cangjie: '竹日山', boshiamy: 'HAU', pinyin: 'zì' },
    '之': { zhuyin: 'ㄓ', cangjie: '戈弓人', boshiamy: 'INO', pinyin: 'zhī' },
    '年': { zhuyin: 'ㄋㄧㄢˊ', cangjie: '人手', boshiamy: 'OQ', pinyin: 'nián' },
    '過': { zhuyin: 'ㄍㄨㄛˋ', cangjie: '卜口月口', boshiamy: 'YRBR', pinyin: 'guò' },
    '發': { zhuyin: 'ㄈㄚ', cangjie: '弓人弓水', boshiamy: 'NONE', pinyin: 'fā' },
    '後': { zhuyin: 'ㄏㄡˋ', cangjie: '竹人戈女大', boshiamy: 'HOIVK', pinyin: 'hòu' },
    '作': { zhuyin: 'ㄗㄨㄛˋ', cangjie: '人竹十', boshiamy: 'OHJ', pinyin: 'zuò' },
    '裡': { zhuyin: 'ㄌㄧˇ', cangjie: '中田土', boshiamy: 'LWG', pinyin: 'lǐ' },
    '用': { zhuyin: 'ㄩㄥˋ', cangjie: '月手', boshiamy: 'BQ', pinyin: 'yòng' },
    '道': { zhuyin: 'ㄉㄠˋ', cangjie: '卜廿竹山', boshiamy: 'YTHU', pinyin: 'dào' },
    '行': { zhuyin: 'ㄒㄧㄥˊ', cangjie: '竹人一一弓', boshiamy: 'HOMMN', pinyin: 'xíng' },
    '所': { zhuyin: 'ㄙㄨㄛˇ', cangjie: '竹尸竹中', boshiamy: 'HSHL', pinyin: 'suǒ' },
    '然': { zhuyin: 'ㄖㄢˊ', cangjie: '月大火', boshiamy: 'BKF', pinyin: 'rán' },
    '家': { zhuyin: 'ㄐㄧㄚ', cangjie: '十一尸人', boshiamy: 'JMSO', pinyin: 'jiā' },
    '種': { zhuyin: 'ㄓㄨㄥˇ', cangjie: '竹木竹十山', boshiamy: 'HDHJM', pinyin: 'zhǒng' },
    '事': { zhuyin: 'ㄕˋ', cangjie: '十中中弓', boshiamy: 'JLLN', pinyin: 'shì' },
    '成': { zhuyin: 'ㄔㄥˊ', cangjie: '戈竹尸', boshiamy: 'IHS', pinyin: 'chéng' },
    '方': { zhuyin: 'ㄈㄤ', cangjie: '卜竹尸', boshiamy: 'YHS', pinyin: 'fāng' },
    '多': { zhuyin: 'ㄉㄨㄛ', cangjie: '弓戈弓戈', boshiamy: 'NINI', pinyin: 'duō' },
    '經': { zhuyin: 'ㄐㄧㄥ', cangjie: '女火一女一', boshiamy: 'VFMVM', pinyin: 'jīng' },
    '去': { zhuyin: 'ㄑㄩˋ', cangjie: '土戈', boshiamy: 'GI', pinyin: 'qù' },
    '法': { zhuyin: 'ㄈㄚˇ', cangjie: '水戈土', boshiamy: 'EIG', pinyin: 'fǎ' },
    '學': { zhuyin: 'ㄒㄩㄝˊ', cangjie: '竹月弓木', boshiamy: 'HBND', pinyin: 'xué' },
    '如': { zhuyin: 'ㄖㄨˊ', cangjie: '女口', boshiamy: 'VR', pinyin: 'rú' },
    '都': { zhuyin: 'ㄉㄡ', cangjie: '十日弓中', boshiamy: 'JANL', pinyin: 'dōu' },
    '同': { zhuyin: 'ㄊㄨㄥˊ', cangjie: '月一口', boshiamy: 'BMR', pinyin: 'tóng' },
    '現': { zhuyin: 'ㄒㄧㄢˋ', cangjie: '一土月山山', boshiamy: 'MGBUU', pinyin: 'xiàn' },
    '當': { zhuyin: 'ㄉㄤ', cangjie: '火月口田', boshiamy: 'FBRW', pinyin: 'dāng' },
    '沒': { zhuyin: 'ㄇㄟˊ', cangjie: '水竹弓水', boshiamy: 'EHNE', pinyin: 'méi' },
    '動': { zhuyin: 'ㄉㄨㄥˋ', cangjie: '竹田大尸', boshiamy: 'HWKS', pinyin: 'dòng' },
    '面': { zhuyin: 'ㄇㄧㄢˋ', cangjie: '一田中中', boshiamy: 'MWLL', pinyin: 'miàn' },
    '起': { zhuyin: 'ㄑㄧˇ', cangjie: '走戈尸', boshiamy: 'GIS', pinyin: 'qǐ' },
    '看': { zhuyin: 'ㄎㄢˋ', cangjie: '竹手月山', boshiamy: 'HQBU', pinyin: 'kàn' },
    '定': { zhuyin: 'ㄉㄧㄥˋ', cangjie: '十一卜一', boshiamy: 'JMYM', pinyin: 'dìng' },
    '天': { zhuyin: 'ㄊㄧㄢ', cangjie: '一大', boshiamy: 'MK', pinyin: 'tiān' },
    '分': { zhuyin: 'ㄈㄣ', cangjie: '金尸竹', boshiamy: 'CSH', pinyin: 'fēn' },
    '還': { zhuyin: 'ㄏㄞˊ', cangjie: '卜田田月', boshiamy: 'YWWB', pinyin: 'hái' },
    '進': { zhuyin: 'ㄐㄧㄣˋ', cangjie: '卜竹人土', boshiamy: 'YHOG', pinyin: 'jìn' },
    '好': { zhuyin: 'ㄏㄠˇ', cangjie: '女弓木', boshiamy: 'VND', pinyin: 'hǎo' },
    '小': { zhuyin: 'ㄒㄧㄠˇ', cangjie: '弓金', boshiamy: 'NC', pinyin: 'xiǎo' },
    '部': { zhuyin: 'ㄅㄨˋ', cangjie: '卜口弓中', boshiamy: 'YRNL', pinyin: 'bù' },
    '其': { zhuyin: 'ㄑㄧˊ', cangjie: '廿一金', boshiamy: 'TMC', pinyin: 'qí' },
    '些': { zhuyin: 'ㄒㄧㄝ', cangjie: '卜一心', boshiamy: 'YMP', pinyin: 'xiē' },
    '主': { zhuyin: 'ㄓㄨˇ', cangjie: '卜土', boshiamy: 'YG', pinyin: 'zhǔ' },
    '樣': { zhuyin: 'ㄧㄤˋ', cangjie: '木廿土水', boshiamy: 'DTGE', pinyin: 'yàng' },
    '理': { zhuyin: 'ㄌㄧˇ', cangjie: '一土田土', boshiamy: 'MGWG', pinyin: 'lǐ' },
    '心': { zhuyin: 'ㄒㄧㄣ', cangjie: '心', boshiamy: 'P', pinyin: 'xīn' },
    '她': { zhuyin: 'ㄊㄚ', cangjie: '女心', boshiamy: 'VP', pinyin: 'tā' },
    '本': { zhuyin: 'ㄅㄣˇ', cangjie: '木一', boshiamy: 'DM', pinyin: 'běn' },
    '前': { zhuyin: 'ㄑㄧㄢˊ', cangjie: '竹口月中弓', boshiamy: 'HRBLN', pinyin: 'qián' },
    '開': { zhuyin: 'ㄎㄞ', cangjie: '日弓廿', boshiamy: 'ANT', pinyin: 'kāi' },
    '但': { zhuyin: 'ㄉㄢˋ', cangjie: '人日一', boshiamy: 'OAM', pinyin: 'dàn' },
    '因': { zhuyin: 'ㄧㄣ', cangjie: '田大', boshiamy: 'WK', pinyin: 'yīn' },
    '只': { zhuyin: 'ㄓˇ', cangjie: '口心', boshiamy: 'RP', pinyin: 'zhǐ' },
    '從': { zhuyin: 'ㄘㄨㄥˊ', cangjie: '竹人人人', boshiamy: 'HOOO', pinyin: 'cóng' },
    '想': { zhuyin: 'ㄒㄧㄤˇ', cangjie: '木月心', boshiamy: 'DBP', pinyin: 'xiǎng' },
    '實': { zhuyin: 'ㄕˊ', cangjie: '十月山金', boshiamy: 'JBUC', pinyin: 'shí' },

    // ===== 新聞常用字 =====
    '張': { zhuyin: 'ㄓㄤ', cangjie: '弓尸一', boshiamy: 'NSM', pinyin: 'zhāng' },
    '庭': { zhuyin: 'ㄊㄧㄥˊ', cangjie: '戈弓大土', boshiamy: 'INKG', pinyin: 'tíng' },
    '門': { zhuyin: 'ㄇㄣˊ', cangjie: '日弓', boshiamy: 'AN', pinyin: 'mén' },
    '禁': { zhuyin: 'ㄐㄧㄣˋ', cangjie: '木木戈', boshiamy: 'DDI', pinyin: 'jìn' },
    '止': { zhuyin: 'ㄓˇ', cangjie: '卜中一', boshiamy: 'YLM', pinyin: 'zhǐ' },
    '兒': { zhuyin: 'ㄦˊ', cangjie: '竹山山', boshiamy: 'HUU', pinyin: 'ér' },
    '女': { zhuyin: 'ㄋㄩˇ', cangjie: '女', boshiamy: 'V', pinyin: 'nǚ' },
    '喊': { zhuyin: 'ㄏㄢˇ', cangjie: '口戈戈口', boshiamy: 'RIIR', pinyin: 'hǎn' },
    '媽': { zhuyin: 'ㄇㄚ', cangjie: '女十田火', boshiamy: 'VJWF', pinyin: 'mā' },
    '遭': { zhuyin: 'ㄗㄠ', cangjie: '卜十田日', boshiamy: 'YJWA', pinyin: 'zāo' },
    '爆': { zhuyin: 'ㄅㄠˋ', cangjie: '火日廿水', boshiamy: 'FATE', pinyin: 'bào' },
    '料': { zhuyin: 'ㄌㄧㄠˋ', cangjie: '火木十', boshiamy: 'FDJ', pinyin: 'liào' },
    '被': { zhuyin: 'ㄅㄟˋ', cangjie: '中竹金水', boshiamy: 'LHCE', pinyin: 'bèi' },
    '搭': { zhuyin: 'ㄉㄚ', cangjie: '手廿人口', boshiamy: 'QTOR', pinyin: 'dā' },
    '訕': { zhuyin: 'ㄕㄢˋ', cangjie: '卜口山山', boshiamy: 'YRUU', pinyin: 'shàn' },
    '尊': { zhuyin: 'ㄗㄨㄣ', cangjie: '廿田木戈', boshiamy: 'TWDI', pinyin: 'zūn' },
    '洩': { zhuyin: 'ㄒㄧㄝˋ', cangjie: '水女心水', boshiamy: 'EVPE', pinyin: 'xiè' },
    '真': { zhuyin: 'ㄓㄣ', cangjie: '十月金', boshiamy: 'JBC', pinyin: 'zhēn' },
    '原': { zhuyin: 'ㄩㄢˊ', cangjie: '一竹日火', boshiamy: 'MHAF', pinyin: 'yuán' },

    // ===== 政治新聞 =====
    '台': { zhuyin: 'ㄊㄞˊ', cangjie: '戈口', boshiamy: 'IR', pinyin: 'tái' },
    '灣': { zhuyin: 'ㄨㄢ', cangjie: '水女金女', boshiamy: 'EVCV', pinyin: 'wān' },
    '政': { zhuyin: 'ㄓㄥˋ', cangjie: '一卜人大', boshiamy: 'MYOK', pinyin: 'zhèng' },
    '府': { zhuyin: 'ㄈㄨˇ', cangjie: '戈大付', boshiamy: 'IK', pinyin: 'fǔ' },
    '民': { zhuyin: 'ㄇㄧㄣˊ', cangjie: '口女心', boshiamy: 'RVP', pinyin: 'mín' },
    '黨': { zhuyin: 'ㄉㄤˇ', cangjie: '火金口田', boshiamy: 'FCRW', pinyin: 'dǎng' },
    '選': { zhuyin: 'ㄒㄩㄢˇ', cangjie: '卜田火金', boshiamy: 'YWFC', pinyin: 'xuǎn' },
    '舉': { zhuyin: 'ㄐㄩˇ', cangjie: '竹金手', boshiamy: 'HCQ', pinyin: 'jǔ' },
    '總': { zhuyin: 'ㄗㄨㄥˇ', cangjie: '女火心竹心', boshiamy: 'VFPHP', pinyin: 'zǒng' },
    '統': { zhuyin: 'ㄊㄨㄥˇ', cangjie: '女火卜戈月', boshiamy: 'VFYIB', pinyin: 'tǒng' },
    '立': { zhuyin: 'ㄌㄧˋ', cangjie: '卜廿', boshiamy: 'YT', pinyin: 'lì' },
    '委': { zhuyin: 'ㄨㄟˇ', cangjie: '竹木女', boshiamy: 'HDV', pinyin: 'wěi' },
    '院': { zhuyin: 'ㄩㄢˋ', cangjie: '弓中月山水', boshiamy: 'NLBUE', pinyin: 'yuàn' },
    '長': { zhuyin: 'ㄔㄤˊ', cangjie: '尸一女', boshiamy: 'SMV', pinyin: 'cháng' },
    '市': { zhuyin: 'ㄕˋ', cangjie: '卜中月', boshiamy: 'YLB', pinyin: 'shì' },
    '縣': { zhuyin: 'ㄒㄧㄢˋ', cangjie: '女火月山金', boshiamy: 'VFBUC', pinyin: 'xiàn' },

    // ===== 經濟新聞 =====
    '經': { zhuyin: 'ㄐㄧㄥ', cangjie: '女火一女一', boshiamy: 'VFMVM', pinyin: 'jīng' },
    '濟': { zhuyin: 'ㄐㄧˋ', cangjie: '水卜金口', boshiamy: 'EYCR', pinyin: 'jì' },
    '股': { zhuyin: 'ㄍㄨˇ', cangjie: '月弓竹水', boshiamy: 'BNHE', pinyin: 'gǔ' },
    '票': { zhuyin: 'ㄆㄧㄠˋ', cangjie: '一田火', boshiamy: 'MWF', pinyin: 'piào' },
    '市': { zhuyin: 'ㄕˋ', cangjie: '卜中月', boshiamy: 'YLB', pinyin: 'shì' },
    '場': { zhuyin: 'ㄔㄤˇ', cangjie: '土日一日', boshiamy: 'GAMA', pinyin: 'chǎng' },
    '價': { zhuyin: 'ㄐㄧㄚˋ', cangjie: '人一田金', boshiamy: 'OMWC', pinyin: 'jià' },
    '格': { zhuyin: 'ㄍㄜˊ', cangjie: '木人口', boshiamy: 'DOR', pinyin: 'gé' },
    '漲': { zhuyin: 'ㄓㄤˇ', cangjie: '水弓廿戈', boshiamy: 'ENTI', pinyin: 'zhǎng' },
    '跌': { zhuyin: 'ㄉㄧㄝ', cangjie: '口一人弓大', boshiamy: 'RMONK', pinyin: 'diē' },
    '投': { zhuyin: 'ㄊㄡˊ', cangjie: '手竹弓水', boshiamy: 'QHNE', pinyin: 'tóu' },
    '資': { zhuyin: 'ㄗ', cangjie: '戈人月金', boshiamy: 'IOBC', pinyin: 'zī' },
    '金': { zhuyin: 'ㄐㄧㄣ', cangjie: '金', boshiamy: 'C', pinyin: 'jīn' },
    '銀': { zhuyin: 'ㄧㄣˊ', cangjie: '金日女', boshiamy: 'CAV', pinyin: 'yín' },
    '行': { zhuyin: 'ㄏㄤˊ', cangjie: '竹人一一弓', boshiamy: 'HOMMN', pinyin: 'háng' },
    '業': { zhuyin: 'ㄧㄝˋ', cangjie: '廿金廿木', boshiamy: 'TCTD', pinyin: 'yè' },
    '公': { zhuyin: 'ㄍㄨㄥ', cangjie: '金戈', boshiamy: 'CI', pinyin: 'gōng' },
    '司': { zhuyin: 'ㄙ', cangjie: '尸一口', boshiamy: 'SMR', pinyin: 'sī' },

    // ===== 社會新聞 =====
    '警': { zhuyin: 'ㄐㄧㄥˇ', cangjie: '廿口卜大', boshiamy: 'TRYK', pinyin: 'jǐng' },
    '察': { zhuyin: 'ㄔㄚˊ', cangjie: '十月金月', boshiamy: 'JBCB', pinyin: 'chá' },
    '案': { zhuyin: 'ㄢˋ', cangjie: '十女木', boshiamy: 'JVD', pinyin: 'àn' },
    '件': { zhuyin: 'ㄐㄧㄢˋ', cangjie: '人竹手', boshiamy: 'OHQ', pinyin: 'jiàn' },
    '嫌': { zhuyin: 'ㄒㄧㄢˊ', cangjie: '女廿廿金', boshiamy: 'VTTC', pinyin: 'xián' },
    '犯': { zhuyin: 'ㄈㄢˋ', cangjie: '大竹尸山', boshiamy: 'KHSU', pinyin: 'fàn' },
    '罪': { zhuyin: 'ㄗㄨㄟˋ', cangjie: '田中十一', boshiamy: 'WLJM', pinyin: 'zuì' },
    '刑': { zhuyin: 'ㄒㄧㄥˊ', cangjie: '一廿中弓', boshiamy: 'MTLN', pinyin: 'xíng' },
    '法': { zhuyin: 'ㄈㄚˇ', cangjie: '水戈土', boshiamy: 'EIG', pinyin: 'fǎ' },
    '院': { zhuyin: 'ㄩㄢˋ', cangjie: '弓中月山水', boshiamy: 'NLBUE', pinyin: 'yuàn' },
    '死': { zhuyin: 'ㄙˇ', cangjie: '一弓心', boshiamy: 'MNP', pinyin: 'sǐ' },
    '亡': { zhuyin: 'ㄨㄤˊ', cangjie: '卜女', boshiamy: 'YV', pinyin: 'wáng' },
    '傷': { zhuyin: 'ㄕㄤ', cangjie: '人人口日', boshiamy: 'OORA', pinyin: 'shāng' },
    '害': { zhuyin: 'ㄏㄞˋ', cangjie: '十心口', boshiamy: 'JPR', pinyin: 'hài' },
    '車': { zhuyin: 'ㄔㄜ', cangjie: '十田十', boshiamy: 'JWJ', pinyin: 'chē' },
    '禍': { zhuyin: 'ㄏㄨㄛˋ', cangjie: '戈火口月口', boshiamy: 'IFRBR', pinyin: 'huò' },
    '意': { zhuyin: 'ㄧˋ', cangjie: '卜廿日心', boshiamy: 'YTAP', pinyin: 'yì' },
    '外': { zhuyin: 'ㄨㄞˋ', cangjie: '弓戈卜', boshiamy: 'NIY', pinyin: 'wài' },

    // ===== 科技新聞 =====
    '科': { zhuyin: 'ㄎㄜ', cangjie: '竹木手', boshiamy: 'HDQ', pinyin: 'kē' },
    '技': { zhuyin: 'ㄐㄧˋ', cangjie: '手竹水', boshiamy: 'QHE', pinyin: 'jì' },
    '網': { zhuyin: 'ㄨㄤˇ', cangjie: '女火月卜', boshiamy: 'VFBY', pinyin: 'wǎng' },
    '路': { zhuyin: 'ㄌㄨˋ', cangjie: '口一竹水', boshiamy: 'RMHE', pinyin: 'lù' },
    '電': { zhuyin: 'ㄉㄧㄢˋ', cangjie: '一田山', boshiamy: 'MWU', pinyin: 'diàn' },
    '腦': { zhuyin: 'ㄋㄠˇ', cangjie: '月卜大山', boshiamy: 'BYKU', pinyin: 'nǎo' },
    '手': { zhuyin: 'ㄕㄡˇ', cangjie: '手', boshiamy: 'Q', pinyin: 'shǒu' },
    '機': { zhuyin: 'ㄐㄧ', cangjie: '木戈戈大', boshiamy: 'DIIK', pinyin: 'jī' },
    '軟': { zhuyin: 'ㄖㄨㄢˇ', cangjie: '十十一月山', boshiamy: 'JJMBU', pinyin: 'ruǎn' },
    '體': { zhuyin: 'ㄊㄧˇ', cangjie: '月月廿金', boshiamy: 'BBTC', pinyin: 'tǐ' },
    '硬': { zhuyin: 'ㄧㄥˋ', cangjie: '一口一中月', boshiamy: 'MRMLB', pinyin: 'yìng' },
    '件': { zhuyin: 'ㄐㄧㄢˋ', cangjie: '人竹手', boshiamy: 'OHQ', pinyin: 'jiàn' },
    '程': { zhuyin: 'ㄔㄥˊ', cangjie: '竹木口土', boshiamy: 'HDRG', pinyin: 'chéng' },
    '式': { zhuyin: 'ㄕˋ', cangjie: '戈心', boshiamy: 'IP', pinyin: 'shì' },
    '資': { zhuyin: 'ㄗ', cangjie: '戈人月金', boshiamy: 'IOBC', pinyin: 'zī' },
    '料': { zhuyin: 'ㄌㄧㄠˋ', cangjie: '火木十', boshiamy: 'FDJ', pinyin: 'liào' },
    '庫': { zhuyin: 'ㄎㄨˋ', cangjie: '戈十田', boshiamy: 'IJW', pinyin: 'kù' },

    // ===== 娛樂新聞 =====
    '娛': { zhuyin: 'ㄩˊ', cangjie: '女人弓大', boshiamy: 'VONK', pinyin: 'yú' },
    '樂': { zhuyin: 'ㄌㄜˋ', cangjie: '女戈木', boshiamy: 'VID', pinyin: 'lè' },
    '明': { zhuyin: 'ㄇㄧㄥˊ', cangjie: '日月', boshiamy: 'AB', pinyin: 'míng' },
    '星': { zhuyin: 'ㄒㄧㄥ', cangjie: '日竹手一', boshiamy: 'AHQM', pinyin: 'xīng' },
    '演': { zhuyin: 'ㄧㄢˇ', cangjie: '水十月女', boshiamy: 'EJBV', pinyin: 'yǎn' },
    '員': { zhuyin: 'ㄩㄢˊ', cangjie: '口月山金', boshiamy: 'RBUC', pinyin: 'yuán' },
    '導': { zhuyin: 'ㄉㄠˇ', cangjie: '廿山弓戈', boshiamy: 'TUNI', pinyin: 'dǎo' },
    '影': { zhuyin: 'ㄧㄥˇ', cangjie: '日廿竹竹水', boshiamy: 'ATHHE', pinyin: 'yǐng' },
    '片': { zhuyin: 'ㄆㄧㄢˋ', cangjie: '中中竹木', boshiamy: 'LLHD', pinyin: 'piàn' },
    '視': { zhuyin: 'ㄕˋ', cangjie: '戈火月山山', boshiamy: 'IFBUU', pinyin: 'shì' },
    '劇': { zhuyin: 'ㄐㄩˋ', cangjie: '卜戈中弓', boshiamy: 'YILN', pinyin: 'jù' },
    '歌': { zhuyin: 'ㄍㄜ', cangjie: '一弓人弓人', boshiamy: 'MNONO', pinyin: 'gē' },
    '曲': { zhuyin: 'ㄑㄩˇ', cangjie: '廿田', boshiamy: 'TW', pinyin: 'qǔ' },
    '唱': { zhuyin: 'ㄔㄤˋ', cangjie: '口日一日', boshiamy: 'RAMA', pinyin: 'chàng' },
    '紅': { zhuyin: 'ㄏㄨㄥˊ', cangjie: '女火一', boshiamy: 'VFM', pinyin: 'hóng' },

    // ===== 體育新聞 =====
    '賽': { zhuyin: 'ㄙㄞˋ', cangjie: '十月月金', boshiamy: 'JBBC', pinyin: 'sài' },
    '冠': { zhuyin: 'ㄍㄨㄢˋ', cangjie: '月一山戈', boshiamy: 'BMUI', pinyin: 'guàn' },
    '軍': { zhuyin: 'ㄐㄩㄣ', cangjie: '月十十', boshiamy: 'BJJ', pinyin: 'jūn' },
    '隊': { zhuyin: 'ㄉㄨㄟˋ', cangjie: '弓中人戈土', boshiamy: 'NLOIG', pinyin: 'duì' },
    '球': { zhuyin: 'ㄑㄧㄡˊ', cangjie: '一土戈水', boshiamy: 'MGIE', pinyin: 'qiú' },
    '員': { zhuyin: 'ㄩㄢˊ', cangjie: '口月山金', boshiamy: 'RBUC', pinyin: 'yuán' },
    '勝': { zhuyin: 'ㄕㄥˋ', cangjie: '月月弓大尸', boshiamy: 'BBNKS', pinyin: 'shèng' },
    '負': { zhuyin: 'ㄈㄨˋ', cangjie: '弓月金', boshiamy: 'NBC', pinyin: 'fù' },
    '分': { zhuyin: 'ㄈㄣ', cangjie: '金尸竹', boshiamy: 'CSH', pinyin: 'fēn' },
    '得': { zhuyin: 'ㄉㄜˊ', cangjie: '竹人日一', boshiamy: 'HOAM', pinyin: 'dé' },
    '運': { zhuyin: 'ㄩㄣˋ', cangjie: '卜月月金', boshiamy: 'YBBC', pinyin: 'yùn' },
    '動': { zhuyin: 'ㄉㄨㄥˋ', cangjie: '竹田大尸', boshiamy: 'HWKS', pinyin: 'dòng' },

    // ===== 國際新聞 =====
    '美': { zhuyin: 'ㄇㄟˇ', cangjie: '廿大', boshiamy: 'TK', pinyin: 'měi' },
    '國': { zhuyin: 'ㄍㄨㄛˊ', cangjie: '田戈口一', boshiamy: 'WIRM', pinyin: 'guó' },
    '日': { zhuyin: 'ㄖˋ', cangjie: '日', boshiamy: 'A', pinyin: 'rì' },
    '本': { zhuyin: 'ㄅㄣˇ', cangjie: '木一', boshiamy: 'DM', pinyin: 'běn' },
    '韓': { zhuyin: 'ㄏㄢˊ', cangjie: '十十田戈十', boshiamy: 'JJWIJ', pinyin: 'hán' },
    '中': { zhuyin: 'ㄓㄨㄥ', cangjie: '中', boshiamy: 'L', pinyin: 'zhōng' },
    '歐': { zhuyin: 'ㄡ', cangjie: '尸一人卜', boshiamy: 'SMOY', pinyin: 'ōu' },
    '洲': { zhuyin: 'ㄓㄡ', cangjie: '水戈中中', boshiamy: 'EILL', pinyin: 'zhōu' },
    '英': { zhuyin: 'ㄧㄥ', cangjie: '廿月大', boshiamy: 'TBK', pinyin: 'yīng' },
    '法': { zhuyin: 'ㄈㄚˇ', cangjie: '水戈土', boshiamy: 'EIG', pinyin: 'fǎ' },
    '德': { zhuyin: 'ㄉㄜˊ', cangjie: '竹人十一心', boshiamy: 'HOJMP', pinyin: 'dé' },
    '俄': { zhuyin: 'ㄜˊ', cangjie: '人竹手戈', boshiamy: 'OHQI', pinyin: 'é' },
    '羅': { zhuyin: 'ㄌㄨㄛˊ', cangjie: '田中田', boshiamy: 'WLW', pinyin: 'luó' },
    '斯': { zhuyin: 'ㄙ', cangjie: '廿金中一', boshiamy: 'TCLM', pinyin: 'sī' },

    // ===== 天氣新聞 =====
    '氣': { zhuyin: 'ㄑㄧˋ', cangjie: '人弓戈木', boshiamy: 'ONID', pinyin: 'qì' },
    '溫': { zhuyin: 'ㄨㄣ', cangjie: '水日月廿', boshiamy: 'EABT', pinyin: 'wēn' },
    '度': { zhuyin: 'ㄉㄨˋ', cangjie: '戈廿水', boshiamy: 'ITE', pinyin: 'dù' },
    '雨': { zhuyin: 'ㄩˇ', cangjie: '一中月卜', boshiamy: 'MLBY', pinyin: 'yǔ' },
    '風': { zhuyin: 'ㄈㄥ', cangjie: '竹弓中戈', boshiamy: 'HNLI', pinyin: 'fēng' },
    '颱': { zhuyin: 'ㄊㄞˊ', cangjie: '竹弓戈口', boshiamy: 'HNIR', pinyin: 'tái' },
    '晴': { zhuyin: 'ㄑㄧㄥˊ', cangjie: '日手月一', boshiamy: 'AQBM', pinyin: 'qíng' },
    '陰': { zhuyin: 'ㄧㄣ', cangjie: '弓中月戈', boshiamy: 'NLBI', pinyin: 'yīn' },
    '冷': { zhuyin: 'ㄌㄥˇ', cangjie: '戈一人弓', boshiamy: 'IMON', pinyin: 'lěng' },
    '熱': { zhuyin: 'ㄖㄜˋ', cangjie: '土戈火', boshiamy: 'GIF', pinyin: 'rè' },
    '暖': { zhuyin: 'ㄋㄨㄢˇ', cangjie: '日弓山水', boshiamy: 'ANUE', pinyin: 'nuǎn' },

    // ===== 其他常用字 =====
    '問': { zhuyin: 'ㄨㄣˋ', cangjie: '日弓口', boshiamy: 'ANR', pinyin: 'wèn' },
    '題': { zhuyin: 'ㄊㄧˊ', cangjie: '日一月金', boshiamy: 'AMBC', pinyin: 'tí' },
    '答': { zhuyin: 'ㄉㄚˊ', cangjie: '竹人一口', boshiamy: 'HOMR', pinyin: 'dá' },
    '說': { zhuyin: 'ㄕㄨㄛ', cangjie: '卜口金口', boshiamy: 'YRCR', pinyin: 'shuō' },
    '話': { zhuyin: 'ㄏㄨㄚˋ', cangjie: '卜口竹十中', boshiamy: 'YRHJL', pinyin: 'huà' },
    '報': { zhuyin: 'ㄅㄠˋ', cangjie: '土尸水', boshiamy: 'GSE', pinyin: 'bào' },
    '告': { zhuyin: 'ㄍㄠˋ', cangjie: '竹土口', boshiamy: 'HGR', pinyin: 'gào' },
    '知': { zhuyin: 'ㄓ', cangjie: '人口', boshiamy: 'OR', pinyin: 'zhī' },
    '道': { zhuyin: 'ㄉㄠˋ', cangjie: '卜廿竹山', boshiamy: 'YTHU', pinyin: 'dào' },
    '認': { zhuyin: 'ㄖㄣˋ', cangjie: '卜口心心', boshiamy: 'YRPP', pinyin: 'rèn' },
    '為': { zhuyin: 'ㄨㄟˋ', cangjie: '戈大弓火', boshiamy: 'IKNF', pinyin: 'wèi' },
    '表': { zhuyin: 'ㄅㄧㄠˇ', cangjie: '手一女', boshiamy: 'QMV', pinyin: 'biǎo' },
    '示': { zhuyin: 'ㄕˋ', cangjie: '一一火', boshiamy: 'MMF', pinyin: 'shì' },
    '指': { zhuyin: 'ㄓˇ', cangjie: '手日一', boshiamy: 'QAM', pinyin: 'zhǐ' },
    '出': { zhuyin: 'ㄔㄨ', cangjie: '山山', boshiamy: 'UU', pinyin: 'chū' },
    '提': { zhuyin: 'ㄊㄧˊ', cangjie: '手日一人', boshiamy: 'QAMO', pinyin: 'tí' },
    '供': { zhuyin: 'ㄍㄨㄥ', cangjie: '人廿金', boshiamy: 'OTC', pinyin: 'gōng' },
    '需': { zhuyin: 'ㄒㄩ', cangjie: '一月中月戈', boshiamy: 'MBLBI', pinyin: 'xū' },
    '求': { zhuyin: 'ㄑㄧㄡˊ', cangjie: '戈十水', boshiamy: 'IJE', pinyin: 'qiú' },
    '希': { zhuyin: 'ㄒㄧ', cangjie: '大月', boshiamy: 'KB', pinyin: 'xī' },
    '望': { zhuyin: 'ㄨㄤˋ', cangjie: '卜月土', boshiamy: 'YBG', pinyin: 'wàng' },
    '期': { zhuyin: 'ㄑㄧ', cangjie: '廿金月', boshiamy: 'TCB', pinyin: 'qī' },
    '待': { zhuyin: 'ㄉㄞˋ', cangjie: '竹人土戈', boshiamy: 'HOGI', pinyin: 'dài' },
    '新': { zhuyin: 'ㄒㄧㄣ', cangjie: '卜木竹中中', boshiamy: 'YDHLL', pinyin: 'xīn' },
    '舊': { zhuyin: 'ㄐㄧㄡˋ', cangjie: '竹山金尸', boshiamy: 'HUCS', pinyin: 'jiù' },
    '變': { zhuyin: 'ㄅㄧㄢˋ', cangjie: '卜金人大', boshiamy: 'YCOK', pinyin: 'biàn' },
    '化': { zhuyin: 'ㄏㄨㄚˋ', cangjie: '人心', boshiamy: 'OP', pinyin: 'huà' },
    '改': { zhuyin: 'ㄍㄞˇ', cangjie: '尸山人大', boshiamy: 'SUOK', pinyin: 'gǎi' },
    '革': { zhuyin: 'ㄍㄜˊ', cangjie: '廿中十', boshiamy: 'TLJ', pinyin: 'gé' },
    '增': { zhuyin: 'ㄗㄥ', cangjie: '土金日一', boshiamy: 'GCAM', pinyin: 'zēng' },
    '加': { zhuyin: 'ㄐㄧㄚ', cangjie: '大尸口', boshiamy: 'KSR', pinyin: 'jiā' },
    '減': { zhuyin: 'ㄐㄧㄢˇ', cangjie: '水戈口大', boshiamy: 'EIRK', pinyin: 'jiǎn' },
    '少': { zhuyin: 'ㄕㄠˇ', cangjie: '火竹', boshiamy: 'FH', pinyin: 'shǎo' },
    '高': { zhuyin: 'ㄍㄠ', cangjie: '卜口月口', boshiamy: 'YRBR', pinyin: 'gāo' },
    '低': { zhuyin: 'ㄉㄧ', cangjie: '人竹心一', boshiamy: 'OHPM', pinyin: 'dī' },
    '快': { zhuyin: 'ㄎㄨㄞˋ', cangjie: '心大大', boshiamy: 'PKK', pinyin: 'kuài' },
    '慢': { zhuyin: 'ㄇㄢˋ', cangjie: '心日女水', boshiamy: 'PAVE', pinyin: 'màn' },
    '強': { zhuyin: 'ㄑㄧㄤˊ', cangjie: '弓戈中一戈', boshiamy: 'NILMI', pinyin: 'qiáng' },
    '弱': { zhuyin: 'ㄖㄨㄛˋ', cangjie: '弓一弓戈', boshiamy: 'NMNI', pinyin: 'ruò' },
    '難': { zhuyin: 'ㄋㄢˊ', cangjie: '廿人土戈', boshiamy: 'TOGI', pinyin: 'nán' },
    '易': { zhuyin: 'ㄧˋ', cangjie: '日一金', boshiamy: 'AMC', pinyin: 'yì' },
    '安': { zhuyin: 'ㄢ', cangjie: '十女', boshiamy: 'JV', pinyin: 'ān' },
    '全': { zhuyin: 'ㄑㄩㄢˊ', cangjie: '人一土', boshiamy: 'OMG', pinyin: 'quán' },
    '危': { zhuyin: 'ㄨㄟˊ', cangjie: '弓一心', boshiamy: 'NMP', pinyin: 'wéi' },
    '險': { zhuyin: 'ㄒㄧㄢˇ', cangjie: '弓中人一人', boshiamy: 'NLOMO', pinyin: 'xiǎn' },
    '健': { zhuyin: 'ㄐㄧㄢˋ', cangjie: '人日女女', boshiamy: 'OAVV', pinyin: 'jiàn' },
    '康': { zhuyin: 'ㄎㄤ', cangjie: '戈中水', boshiamy: 'ILE', pinyin: 'kāng' },
    '病': { zhuyin: 'ㄅㄧㄥˋ', cangjie: '大一人十', boshiamy: 'KMOJ', pinyin: 'bìng' },
    '醫': { zhuyin: 'ㄧ', cangjie: '尸大人月田', boshiamy: 'SKOBW', pinyin: 'yī' },
    '院': { zhuyin: 'ㄩㄢˋ', cangjie: '弓中月山水', boshiamy: 'NLBUE', pinyin: 'yuàn' },
    '藥': { zhuyin: 'ㄧㄠˋ', cangjie: '廿女田木', boshiamy: 'TVWD', pinyin: 'yào' },
    '物': { zhuyin: 'ㄨˋ', cangjie: '竹手心竹', boshiamy: 'HQPH', pinyin: 'wù' },
    '食': { zhuyin: 'ㄕˊ', cangjie: '人戈日', boshiamy: 'OIA', pinyin: 'shí' },
    '品': { zhuyin: 'ㄆㄧㄣˇ', cangjie: '口口口', boshiamy: 'RRR', pinyin: 'pǐn' },
    '質': { zhuyin: 'ㄓˋ', cangjie: '竹竹月金', boshiamy: 'HHBC', pinyin: 'zhì' },
    '量': { zhuyin: 'ㄌㄧㄤˋ', cangjie: '一田土', boshiamy: 'MWG', pinyin: 'liàng' },

    // ===== 更多補充 =====
    '呢': { zhuyin: 'ㄋㄜ˙', cangjie: '口尸心', boshiamy: 'RSP', pinyin: 'ne' },
    '吧': { zhuyin: 'ㄅㄚ˙', cangjie: '口日山', boshiamy: 'RAU', pinyin: 'ba' },
    '啊': { zhuyin: 'ㄚ˙', cangjie: '口一尸口', boshiamy: 'RMSR', pinyin: 'a' },
    '嗎': { zhuyin: 'ㄇㄚ˙', cangjie: '口尸手火', boshiamy: 'RSQF', pinyin: 'ma' },
    '什': { zhuyin: 'ㄕㄣˊ', cangjie: '人十', boshiamy: 'OJ', pinyin: 'shén' },
    '麼': { zhuyin: 'ㄇㄜ˙', cangjie: '戈金竹', boshiamy: 'ICH', pinyin: 'me' },
    '怎': { zhuyin: 'ㄗㄣˇ', cangjie: '竹心心', boshiamy: 'HPP', pinyin: 'zěn' },
    '樣': { zhuyin: 'ㄧㄤˋ', cangjie: '木廿土水', boshiamy: 'DTGE', pinyin: 'yàng' },
    '這': { zhuyin: 'ㄓㄜˋ', cangjie: '卜口一弓', boshiamy: 'YRMN', pinyin: 'zhè' },
    '裡': { zhuyin: 'ㄌㄧˇ', cangjie: '中田土', boshiamy: 'LWG', pinyin: 'lǐ' },
    '哪': { zhuyin: 'ㄋㄚˇ', cangjie: '口尸手中', boshiamy: 'RSQL', pinyin: 'nǎ' },
    '誰': { zhuyin: 'ㄕㄟˊ', cangjie: '卜口人土', boshiamy: 'YROG', pinyin: 'shéi' },
    '幾': { zhuyin: 'ㄐㄧˇ', cangjie: '女戈竹大', boshiamy: 'VIHK', pinyin: 'jǐ' },
    '多': { zhuyin: 'ㄉㄨㄛ', cangjie: '弓戈弓戈', boshiamy: 'NINI', pinyin: 'duō' },
    '少': { zhuyin: 'ㄕㄠˇ', cangjie: '火竹', boshiamy: 'FH', pinyin: 'shǎo' },
    '第': { zhuyin: 'ㄉㄧˋ', cangjie: '竹弓中月', boshiamy: 'HNLB', pinyin: 'dì' },
    '次': { zhuyin: 'ㄘˋ', cangjie: '戈一弓人', boshiamy: 'IMNO', pinyin: 'cì' },
    '再': { zhuyin: 'ㄗㄞˋ', cangjie: '一土火山', boshiamy: 'MGFU', pinyin: 'zài' },
    '又': { zhuyin: 'ㄧㄡˋ', cangjie: '弓大', boshiamy: 'NK', pinyin: 'yòu' },
    '已': { zhuyin: 'ㄧˇ', cangjie: '尸山', boshiamy: 'SU', pinyin: 'yǐ' },
    '經': { zhuyin: 'ㄐㄧㄥ', cangjie: '女火一女一', boshiamy: 'VFMVM', pinyin: 'jīng' },
    '正': { zhuyin: 'ㄓㄥˋ', cangjie: '一卜一一', boshiamy: 'MYMM', pinyin: 'zhèng' },
    '在': { zhuyin: 'ㄗㄞˋ', cangjie: '大土', boshiamy: 'KG', pinyin: 'zài' },
    '將': { zhuyin: 'ㄐㄧㄤ', cangjie: '女一土戈', boshiamy: 'VMGI', pinyin: 'jiāng' },
    '會': { zhuyin: 'ㄏㄨㄟˋ', cangjie: '人一日火', boshiamy: 'OMAF', pinyin: 'huì' },
    '曾': { zhuyin: 'ㄘㄥˊ', cangjie: '金田日', boshiamy: 'CWA', pinyin: 'céng' },
    '讓': { zhuyin: 'ㄖㄤˋ', cangjie: '卜口卜口女', boshiamy: 'YRYRV', pinyin: 'ràng' },
    '使': { zhuyin: 'ㄕˇ', cangjie: '人中大', boshiamy: 'OLK', pinyin: 'shǐ' },
    '令': { zhuyin: 'ㄌㄧㄥˋ', cangjie: '人戈弓', boshiamy: 'OIN', pinyin: 'lìng' },
    '更': { zhuyin: 'ㄍㄥˋ', cangjie: '一中田水', boshiamy: 'MLWE', pinyin: 'gèng' },
    '最': { zhuyin: 'ㄗㄨㄟˋ', cangjie: '日日廿', boshiamy: 'AAT', pinyin: 'zuì' },
    '非': { zhuyin: 'ㄈㄟ', cangjie: '中一卜卜', boshiamy: 'LMYY', pinyin: 'fēi' },
    '常': { zhuyin: 'ㄔㄤˊ', cangjie: '火月口', boshiamy: 'FBR', pinyin: 'cháng' },
    '每': { zhuyin: 'ㄇㄟˇ', cangjie: '人田卜', boshiamy: 'OWY', pinyin: 'měi' },
    '各': { zhuyin: 'ㄍㄜˋ', cangjie: '竹水口', boshiamy: 'HER', pinyin: 'gè' },
    '別': { zhuyin: 'ㄅㄧㄝˊ', cangjie: '口中尸竹', boshiamy: 'RLSH', pinyin: 'bié' },
    '另': { zhuyin: 'ㄌㄧㄥˋ', cangjie: '口尸', boshiamy: 'RS', pinyin: 'lìng' },
    '其': { zhuyin: 'ㄑㄧˊ', cangjie: '廿一金', boshiamy: 'TMC', pinyin: 'qí' },
    '他': { zhuyin: 'ㄊㄚ', cangjie: '人心', boshiamy: 'OP', pinyin: 'tā' },
    '它': { zhuyin: 'ㄊㄚ', cangjie: '十心', boshiamy: 'JP', pinyin: 'tā' },
    '此': { zhuyin: 'ㄘˇ', cangjie: '卜一心', boshiamy: 'YMP', pinyin: 'cǐ' },
    '彼': { zhuyin: 'ㄅㄧˇ', cangjie: '竹人心水', boshiamy: 'HOPE', pinyin: 'bǐ' },
    '何': { zhuyin: 'ㄏㄜˊ', cangjie: '人一弓口', boshiamy: 'OMNR', pinyin: 'hé' },
    '若': { zhuyin: 'ㄖㄨㄛˋ', cangjie: '廿大口', boshiamy: 'TKR', pinyin: 'ruò' },
    '或': { zhuyin: 'ㄏㄨㄛˋ', cangjie: '戈口一弓', boshiamy: 'IRMN', pinyin: 'huò' },
    '者': { zhuyin: 'ㄓㄜˇ', cangjie: '十大日', boshiamy: 'JKA', pinyin: 'zhě' },
    '比': { zhuyin: 'ㄅㄧˇ', cangjie: '心心', boshiamy: 'PP', pinyin: 'bǐ' },
    '較': { zhuyin: 'ㄐㄧㄠˋ', cangjie: '十十卜金大', boshiamy: 'JJYCK', pinyin: 'jiào' },

    // ===== 新增常用字 =====
    '鄭': { zhuyin: 'ㄓㄥˋ', cangjie: '月月弓中', boshiamy: 'BBNL', pinyin: 'zhèng' },
    '染': { zhuyin: 'ㄖㄢˇ', cangjie: '水木尸', boshiamy: 'EDS', pinyin: 'rǎn' },
    '禽': { zhuyin: 'ㄑㄧㄣˊ', cangjie: '人戈火', boshiamy: 'OIF', pinyin: 'qín' },
    '流': { zhuyin: 'ㄌㄧㄡˊ', cangjie: '水卜戈山', boshiamy: 'EYIU', pinyin: 'liú' },
    '感': { zhuyin: 'ㄍㄢˇ', cangjie: '戈口心', boshiamy: 'IRP', pinyin: 'gǎn' },
    '牧': { zhuyin: 'ㄇㄨˋ', cangjie: '竹手人大', boshiamy: 'HQOK', pinyin: 'mù' },
    '標': { zhuyin: 'ㄅㄧㄠ', cangjie: '木一田火', boshiamy: 'DMWF', pinyin: 'biāo' },
    '榜': { zhuyin: 'ㄅㄤˇ', cangjie: '木卜月尸', boshiamy: 'DYBS', pinyin: 'bǎng' },
    '福': { zhuyin: 'ㄈㄨˊ', cangjie: '戈火一口田', boshiamy: 'IFMRW', pinyin: 'fú' },
    '蛋': { zhuyin: 'ㄉㄢˋ', cangjie: '日火中戈', boshiamy: 'AFLI', pinyin: 'dàn' },
    '透': { zhuyin: 'ㄊㄡˋ', cangjie: '卜竹木月', boshiamy: 'YHDB', pinyin: 'tòu' },
    '賣': { zhuyin: 'ㄇㄞˋ', cangjie: '土田金', boshiamy: 'GWC', pinyin: 'mài' },
    '全': { zhuyin: 'ㄑㄩㄢˊ', cangjie: '人一土', boshiamy: 'OMG', pinyin: 'quán' },
};

// 編碼快取
const encodingCache = {};

// 取得字元編碼（優先使用本地資料，否則查詢 API）
async function getEncodingAsync(char) {
    // 先檢查快取
    if (encodingCache[char]) {
        return encodingCache[char];
    }

    // 檢查本地資料庫
    if (encodingData[char]) {
        encodingCache[char] = encodingData[char];
        return encodingData[char];
    }

    // 查詢外部 API（萌典）
    try {
        const response = await fetch(`https://www.moedict.tw/uni/${char}.json`);
        if (response.ok) {
            const data = await response.json();
            const encoding = {
                zhuyin: data.heteronyms?.[0]?.bopomofo || '無資料',
                pinyin: data.heteronyms?.[0]?.pinyin || '無資料',
                cangjie: '查詢中...',
                boshiamy: '查詢中...'
            };

            // 嘗試從 CNS11643 API 取得倉頡碼
            try {
                const cnsResponse = await fetch(`https://www.cns11643.gov.tw/AIDB/query.do?q=${encodeURIComponent(char)}`);
                // CNS API 可能有 CORS 限制，這裡只是嘗試
            } catch (e) {
                // 忽略錯誤
            }

            // 如果 API 沒有倉頡/無蝦米，標記為無資料
            encoding.cangjie = encoding.cangjie === '查詢中...' ? '無資料' : encoding.cangjie;
            encoding.boshiamy = encoding.boshiamy === '查詢中...' ? '無資料' : encoding.boshiamy;

            encodingCache[char] = encoding;
            return encoding;
        }
    } catch (error) {
        console.error('API 查詢失敗:', error);
    }

    return null;
}

// 同步版本（用於向後相容）
function getEncoding(char) {
    if (encodingCache[char]) {
        return encodingCache[char];
    }
    if (encodingData[char]) {
        return encodingData[char];
    }
    return null;
}

// 檢查是否為中文字元
function isChinese(char) {
    return /[\u4e00-\u9fff]/.test(char);
}
