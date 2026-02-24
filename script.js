// Google News RSS URLs
const RSS_URLS = {
    zh: 'https://news.google.com/rss?hl=zh-TW&gl=TW&ceid=TW:zh-Hant',
    en: 'https://news.google.com/rss?hl=en&gl=US&ceid=US:en'
};

// CORS Proxy
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// 每種語言抓取的新聞數量
const NEWS_COUNT = 20;

// localStorage keys
const STORAGE_KEYS = {
    DATA_VERSION: 'typing_data_version',
    NEWS_DATE: 'typing_news_date',
    NEWS_ZH: 'typing_news_zh',
    NEWS_EN: 'typing_news_en',
    ENCODING_CACHE: 'typing_encoding_cache',
    LEADERBOARD_ZH: 'typing_leaderboard_zh',
    LEADERBOARD_EN: 'typing_leaderboard_en',
    AUTO_SHOW_ENCODING: 'typing_auto_show_encoding',
    THEME: 'typing_theme'
};

// 資料版本號 - 更新此版本號會清除舊的快取資料
const DATA_VERSION = '3.0';

// 字碼練習的字符集定義
const CODE_CHARACTERS = {
    english: {
        chars: 'abcdefghijklmnopqrstuvwxyz',
        name: '英文',
        keyMap: null  // 直接按對應鍵，無需映射
    },
    zhuyin: {
        chars: 'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ',
        name: '注音',
        keyMap: {
            '1': 'ㄅ', 'q': 'ㄆ', 'a': 'ㄇ', 'z': 'ㄈ',
            '2': 'ㄉ', 'w': 'ㄊ', 's': 'ㄋ', 'x': 'ㄌ',
            'e': 'ㄍ', 'd': 'ㄎ', 'c': 'ㄏ',
            'r': 'ㄐ', 'f': 'ㄑ', 'v': 'ㄒ',
            '5': 'ㄓ', 't': 'ㄔ', 'g': 'ㄕ', 'b': 'ㄖ',
            'y': 'ㄗ', 'h': 'ㄘ', 'n': 'ㄙ',
            'u': 'ㄧ', 'j': 'ㄨ', 'm': 'ㄩ',
            '8': 'ㄚ', 'i': 'ㄛ', 'k': 'ㄜ', ',': 'ㄝ',
            '9': 'ㄞ', 'o': 'ㄟ', 'l': 'ㄠ', '.': 'ㄡ',
            '0': 'ㄢ', 'p': 'ㄣ', ';': 'ㄤ',
            '-': 'ㄥ', '/': 'ㄦ'
        }
    },
    cangjie: {
        chars: '日月金木水火土竹戈十大中一弓人心手口尸廿山女田難卜符',
        name: '倉頡',
        keyMap: {
            'a': '日', 'b': '月', 'c': '金', 'd': '木', 'e': '水',
            'f': '火', 'g': '土', 'h': '竹', 'i': '戈', 'j': '十',
            'k': '大', 'l': '中', 'm': '一', 'n': '弓', 'o': '人',
            'p': '心', 'q': '手', 'r': '口', 's': '尸', 't': '廿',
            'u': '山', 'v': '女', 'w': '田', 'x': '難', 'y': '卜', 'z': '符'
        }
    }
};
// 字典資料 (從 dictionary-data.js 預載入，或從 dictionary.json 動態載入)
// 格式: { char: { zhuyin, cangjie, boshiamy, pinyin } }
// 注意: dictionary-data.js 使用 var 宣告，所以這裡可以安全地條件式宣告
if (typeof dictionaryData === 'undefined') {
    var dictionaryData = {};
}

// 載入 dictionary.json 並轉換格式（僅當 dictionaryData 為空時）
async function loadDictionary() {
    // 如果 dictionaryData 已從 dictionary-data.js 預載入，就跳過
    if (Object.keys(dictionaryData).length > 0) {
        console.log(`Dictionary pre-loaded: ${Object.keys(dictionaryData).length} characters`);
        return true;
    }

    // 否則嘗試用 fetch 載入 dictionary.json
    try {
        const response = await fetch('dictionary.json');
        if (response.ok) {
            const data = await response.json();
            // 將 Array 格式轉換為 Object 格式
            data.forEach(entry => {
                const [char, zhuyin, cangjie, boshiamy, pinyin] = entry;
                dictionaryData[char] = { zhuyin, cangjie, boshiamy, pinyin };
            });
            console.log(`Dictionary loaded via fetch: ${Object.keys(dictionaryData).length} characters`);
            return true;
        }
    } catch (error) {
        console.warn('Failed to load dictionary.json (this is OK if using file:// protocol):', error.message);
    }
    return false;
}

// 當前模式 ('zh' 或 'en')
let currentMode = 'zh';
// 內容模式 ('sentence' | 'article' | 'code')
let contentMode = 'sentence';
// 字碼練習類型 ('english' | 'zhuyin' | 'cangjie')
let codeType = 'cangjie';
// 當前主題
let currentTheme = 'dark';
let currentPassage = '';
let startTime = null;
let errorCount = 0;
let isTestComplete = false;
// 自動顯示編碼提示
let autoShowEncoding = true;
// 追蹤上一次正確輸入的字符數量
let previousCorrectCount = 0;

// 新聞資料（從 localStorage 載入，或使用備用句子）
// 備用句子：當 fetch 無法載入新聞時使用（例如 file:// 協議）
const FALLBACK_SENTENCES = {
    zh: [
        '科技發展日新月異，人工智慧正在改變我們的生活方式。',
        '全球暖化問題日益嚴重，各國紛紛提出減碳目標。',
        '教育是國家發展的根本，培養人才是最重要的投資。',
        '健康飲食和規律運動是維持身體健康的不二法門。',
        '閱讀能夠開拓視野，增進知識，培養獨立思考能力。'
    ],
    en: [
        'Technology advances rapidly, transforming how we live and work.',
        'Climate change poses significant challenges to global communities.',
        'Education empowers individuals and drives economic growth.',
        'Regular exercise and balanced nutrition promote well-being.',
        'Reading expands horizons and cultivates critical thinking.'
    ]
};

let newsData = {
    zh: [],
    en: []
};

// 文章資料（完整新聞內文）
let articleData = {
    zh: [],
    en: []
};

// 備用文章
const FALLBACK_ARTICLES = {
    zh: [{
        title: '人工智慧的發展與未來',
        content: '人工智慧技術近年來取得了突破性的進展。從語音辨識到自然語言處理，從電腦視覺到自動駕駛，AI正在改變我們生活的方方面面。專家預測，未來十年內，人工智慧將會更深入地融入我們的日常生活，帶來更多便利的同時，也將帶來新的挑戰和機遇。隨著技術的不斷發展，我們需要思考如何在享受科技便利的同時，確保人工智慧的發展能夠造福全人類。'
    }],
    en: [{
        title: 'The Future of Artificial Intelligence',
        content: 'Artificial intelligence has made remarkable progress in recent years. From speech recognition to natural language processing, from computer vision to autonomous driving, AI is transforming every aspect of our lives. Experts predict that in the next decade, artificial intelligence will become even more integrated into our daily routines, bringing both new conveniences and challenges. As technology continues to evolve, we need to consider how to ensure that AI development benefits all of humanity while enjoying its conveniences.'
    }]
};

// 編碼快取（持久化）
let persistentEncodingCache = {};

// DOM 元素
// DOM 元素 (將在 bootstrap 中初始化)
let loadingOverlay = null;
let loadingStatus = null;
let textDisplay = null;
let charSpans = [];
let inputArea = null;
let resultsDiv = null;
let wpmSpan = null;
let accuracySpan = null;
let restartBtn = null;
let modeEnBtn = null;
let modeZhBtn = null;
let modeSentenceBtn = null;
let modeArticleBtn = null;
let modeCodeBtn = null;
let achievementDiv = null;
let leaderboardList = null;
let newsCountSpan = null;
let scoreSpan = null;
let autoShowEncodingCheckbox = null;
let virtualKeyboard = null;

// 編碼提示元素
const encodingHint = document.getElementById('encoding-hint');
const hintChar = document.getElementById('hint-char');
const hintZhuyin = document.getElementById('hint-zhuyin');
const hintCangjie = document.getElementById('hint-cangjie');
const hintBoshiamy = document.getElementById('hint-boshiamy');
const hintPinyin = document.getElementById('hint-pinyin');

// ===== localStorage 工具函式 =====

function getTodayString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('localStorage 讀取失敗:', e);
        return null;
    }
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('localStorage 寫入失敗:', e);
    }
}

// ===== 編碼快取管理 =====

function loadEncodingCache() {
    const cached = loadFromStorage(STORAGE_KEYS.ENCODING_CACHE);
    if (cached) {
        persistentEncodingCache = cached;
    }
}

function saveEncodingCache() {
    saveToStorage(STORAGE_KEYS.ENCODING_CACHE, persistentEncodingCache);
}

// ===== 自動顯示編碼設定 =====

function loadAutoShowEncodingSetting() {
    const saved = loadFromStorage(STORAGE_KEYS.AUTO_SHOW_ENCODING);
    // 預設為 true（開啟）
    autoShowEncoding = saved !== null ? saved : true;

    // 更新 checkbox 狀態
    if (autoShowEncodingCheckbox) {
        autoShowEncodingCheckbox.checked = autoShowEncoding;
    }
}

function saveAutoShowEncodingSetting() {
    saveToStorage(STORAGE_KEYS.AUTO_SHOW_ENCODING, autoShowEncoding);
}

function toggleAutoShowEncoding(enabled) {
    autoShowEncoding = enabled;
    saveAutoShowEncodingSetting();

    // 如果關閉自動顯示，則隱藏編碼提示
    if (!autoShowEncoding) {
        hideEncodingHint();
    } else if (currentMode === 'zh' && !isTestComplete) {
        // 如果開啟自動顯示且在中文模式，立即顯示當前字符的編碼
        showEncodingHint();
    }

    // 連動虛擬鍵盤顯示
    updateVirtualKeyboardVisibility();
}

// ===== 主題管理 =====

function loadTheme() {
    const saved = loadFromStorage(STORAGE_KEYS.THEME);
    // 預設為 'dark' 主題
    currentTheme = saved || 'dark';
    applyTheme(currentTheme, false);
}

function applyTheme(themeName, save = true) {
    // 移除所有主題類別
    document.body.classList.remove('theme-dark', 'theme-grayscale', 'theme-contrast', 'theme-light');

    // 添加新的主題類別
    document.body.classList.add(`theme-${themeName}`);

    // 更新當前主題
    currentTheme = themeName;

    // 儲存到 localStorage
    if (save) {
        saveToStorage(STORAGE_KEYS.THEME, themeName);
    }
}

function initThemeControls() {
    const themeButtons = document.querySelectorAll('.theme-switch button');

    themeButtons.forEach(button => {
        const theme = button.dataset.theme;

        // 設定初始 active 狀態
        if (theme === currentTheme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }

        // 添加點擊事件
        button.onclick = () => {
            // 移除所有按鈕的 active 類別
            themeButtons.forEach(btn => btn.classList.remove('active'));

            // 添加 active 到被點擊的按鈕
            button.classList.add('active');

            // 套用主題
            applyTheme(theme);
        };
    });
}

// 移除拼音聲調數字（ni3 -> ni）
function removePinyinTone(pinyin) {
    if (!pinyin || pinyin === '無資料' || pinyin === '查詢中...' || pinyin === '查無資料' || pinyin === '非中文') {
        return pinyin;
    }
    // 移除結尾的數字 1-5
    return pinyin.replace(/[1-5]$/g, '');
}

// 取得編碼（同步，從快取或本地資料庫）
function getCachedEncoding(char) {
    // 1. 先檢查新的 dictionary.json 資料（優先）
    if (dictionaryData[char]) {
        return dictionaryData[char];
    }
    // 2. 再檢查持久化快取
    if (persistentEncodingCache[char]) {
        return persistentEncodingCache[char];
    }
    // 3. 最後檢查舊的本地資料庫（encoding-data.js，向後相容）
    if (typeof encodingData !== 'undefined' && encodingData[char]) {
        return encodingData[char];
    }
    return null;
}

// 即時查詢單一字元編碼並快取
async function fetchEncodingForChar(char) {
    // 已有資料就跳過（優先檢查 dictionary.json）
    if (dictionaryData[char]) return dictionaryData[char];
    if (persistentEncodingCache[char]) return persistentEncodingCache[char];
    if (typeof encodingData !== 'undefined' && encodingData[char]) return encodingData[char];

    try {
        const response = await fetch(`https://www.moedict.tw/uni/${char}.json`);
        if (response.ok) {
            const data = await response.json();
            const encoding = {
                zhuyin: data.heteronyms?.[0]?.bopomofo || '無資料',
                pinyin: data.heteronyms?.[0]?.pinyin || '無資料',
                cangjie: '無資料', // 萌典 API 不含倉頡
                boshiamy: '無資料'  // 萌典 API 不含嘸蝦米
            };
            persistentEncodingCache[char] = encoding;
            saveEncodingCache(); // 儲存快取
            return encoding;
        }
    } catch (error) {
        console.error(`編碼查詢失敗 (${char}):`, error);
    }
    return null;
}

// 預先查詢所有中文字元的編碼
async function prefetchAllEncodings(texts) {
    const allText = texts.join('');
    const chineseChars = [...new Set(allText.split('').filter(isChinese))];

    // 找出需要查詢的字元（優先檢查 dictionary.json）
    const charsToFetch = chineseChars.filter(char =>
        !dictionaryData[char] &&
        !persistentEncodingCache[char] &&
        !(typeof encodingData !== 'undefined' && encodingData[char])
    );

    if (charsToFetch.length === 0) {
        return;
    }

    updateLoadingStatus(`查詢編碼中 (0/${charsToFetch.length})...`);

    // 批次查詢，避免同時太多請求
    const batchSize = 5;
    for (let i = 0; i < charsToFetch.length; i += batchSize) {
        const batch = charsToFetch.slice(i, i + batchSize);
        await Promise.all(batch.map(char => prefetchEncodingForChar(char)));
        updateLoadingStatus(`查詢編碼中 (${Math.min(i + batchSize, charsToFetch.length)}/${charsToFetch.length})...`);
    }

    // 儲存快取
    saveEncodingCache();
}

// ===== 新聞載入 =====

async function fetchNewsFromRSS(mode) {
    const url = RSS_URLS[mode];

    try {
        const response = await fetch(CORS_PROXY + encodeURIComponent(url));
        if (!response.ok) throw new Error('RSS fetch failed');

        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');

        const items = xml.querySelectorAll('item');
        const titles = [];

        items.forEach(item => {
            if (titles.length >= NEWS_COUNT) return;

            const title = item.querySelector('title')?.textContent;
            if (title) {
                let cleanTitle = title.split(' - ')[0].trim();
                if (cleanTitle.length >= 10) {
                    titles.push(cleanTitle);
                }
            }
        });

        return titles;
    } catch (error) {
        console.error('RSS 載入失敗:', error);
        return [];
    }
}

// 更新新聞數量顯示
function updateNewsCount() {
    if (newsCountSpan) {
        if (contentMode === 'code') {
            newsCountSpan.textContent = '隨機生成';
        } else if (contentMode === 'article') {
            newsCountSpan.textContent = articleData[currentMode].length;
        } else {
            newsCountSpan.textContent = newsData[currentMode].length;
        }
    }
}

// 初始化新聞（先用備用句子，讓用戶可以立即開始）
function initNewsWithFallback() {
    newsData.zh = [...FALLBACK_SENTENCES.zh];
    newsData.en = [...FALLBACK_SENTENCES.en];
    articleData.zh = [...FALLBACK_ARTICLES.zh];
    articleData.en = [...FALLBACK_ARTICLES.en];
    console.log('Initialized with fallback sentences (5 each) and articles (1 each)');
}

// 背景載入今日新聞
async function loadTodayNewsInBackground() {
    const today = getTodayString();
    const savedDate = loadFromStorage(STORAGE_KEYS.NEWS_DATE);
    const savedVersion = loadFromStorage(STORAGE_KEYS.DATA_VERSION);

    console.log('=== loadTodayNewsInBackground DEBUG ===');
    console.log('Today:', today);
    console.log('Saved date:', savedDate);
    console.log('Saved version:', savedVersion);
    console.log('Current version:', DATA_VERSION);

    // 如果已是今日資料且版本號正確，直接從 localStorage 載入
    if (savedDate === today && savedVersion === DATA_VERSION) {
        console.log('✓ Date and version match, checking cache...');
        const savedZh = loadFromStorage(STORAGE_KEYS.NEWS_ZH);
        const savedEn = loadFromStorage(STORAGE_KEYS.NEWS_EN);

        console.log('Cached zh length:', savedZh?.length || 0);
        console.log('Cached en length:', savedEn?.length || 0);

        if (savedZh && savedZh.length >= 10 && savedEn && savedEn.length >= 10) {
            newsData.zh = savedZh;
            newsData.en = savedEn;
            updateNewsCount();
            console.log(`✓ Loaded ${newsData.zh.length} zh + ${newsData.en.length} en news from localStorage cache (v${DATA_VERSION})`);
            return;
        } else {
            console.log('✗ Cache data insufficient, will load from JSON');
        }
    } else if (savedVersion !== DATA_VERSION) {
        console.log(`✗ Data version mismatch (saved: ${savedVersion}, current: ${DATA_VERSION}), clearing cache...`);
        localStorage.removeItem(STORAGE_KEYS.NEWS_DATE);
        localStorage.removeItem(STORAGE_KEYS.NEWS_ZH);
        localStorage.removeItem(STORAGE_KEYS.NEWS_EN);
    } else {
        console.log('✗ Date mismatch or no cache, will load from JSON');
    }

    // 嘗試載入 daily_news.json
    console.log('→ Attempting to load daily_news.json...');
    try {
        const url = `daily_news.json?t=${Date.now()}`;
        console.log('Fetch URL:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);

        if (response.ok) {
            const data = await response.json();
            console.log('JSON parsed successfully');
            console.log('JSON date:', data.date);
            console.log('JSON zh length:', data.zh?.length || 0);
            console.log('JSON en length:', data.en?.length || 0);
            console.log('JSON articles_zh length:', data.articles_zh?.length || 0);
            console.log('JSON articles_en length:', data.articles_en?.length || 0);

            if (data.date === today && data.zh && data.en) {
                console.log('✓ Date matches and data exists');
                newsData.zh = data.zh;
                newsData.en = data.en;

                // 載入文章資料
                if (data.articles_zh && data.articles_zh.length > 0) {
                    articleData.zh = data.articles_zh;
                }
                if (data.articles_en && data.articles_en.length > 0) {
                    articleData.en = data.articles_en;
                }

                updateNewsCount();

                // 儲存到 localStorage
                saveToStorage(STORAGE_KEYS.DATA_VERSION, DATA_VERSION);
                saveToStorage(STORAGE_KEYS.NEWS_DATE, today);
                saveToStorage(STORAGE_KEYS.NEWS_ZH, newsData.zh);
                saveToStorage(STORAGE_KEYS.NEWS_EN, newsData.en);

                console.log(`✓✓✓ SUCCESS! Loaded ${newsData.zh.length} zh + ${newsData.en.length} en titles, ${articleData.zh.length} zh + ${articleData.en.length} en articles from daily_news.json (v${DATA_VERSION})`);
                return;
            } else {
                console.log('✗ Date mismatch or missing data');
                console.log('Expected date:', today);
                console.log('Got date:', data.date);
            }
        } else {
            console.log('✗ Response not OK');
        }
    } catch (error) {
        console.error('✗✗✗ Failed to load daily_news.json:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
    }

    // 如果 daily_news.json 不存在或過期，嘗試從 RSS 抓取
    console.log('Fetching news from RSS in background...');
    try {
        const [zhNews, enNews] = await Promise.all([
            fetchNewsFromRSS('zh'),
            fetchNewsFromRSS('en')
        ]);

        if (zhNews.length > 0) {
            newsData.zh = zhNews;
        }
        if (enNews.length > 0) {
            newsData.en = enNews;
        }
        updateNewsCount();

        // 儲存到 localStorage
        saveToStorage(STORAGE_KEYS.NEWS_DATE, today);
        saveToStorage(STORAGE_KEYS.NEWS_ZH, newsData.zh);
        saveToStorage(STORAGE_KEYS.NEWS_EN, newsData.en);

        console.log(`Loaded ${newsData.zh.length} zh + ${newsData.en.length} en news from RSS`);
    } catch (error) {
        console.warn('Failed to fetch RSS:', error.message);
    }
}

// ===== 載入畫面控制 =====

function updateLoadingStatus(message) {
    if (loadingStatus) {
        loadingStatus.textContent = message;
    }
}

function hideLoadingOverlay() {
    if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
}

// ===== 應用程式啟動 =====

async function bootstrap() {
    // 1. 先初始化載入畫面元素（最優先）
    loadingOverlay = document.getElementById('loading-overlay');
    loadingStatus = document.getElementById('loading-status');

    // 2. 初始化其他 DOM 元素
    updateLoadingStatus('初始化介面元素...');
    textDisplay = document.getElementById('text-display');
    inputArea = document.getElementById('input-area');
    resultsDiv = document.getElementById('results');
    wpmSpan = document.getElementById('wpm');
    accuracySpan = document.getElementById('accuracy');
    restartBtn = document.getElementById('restart-btn');
    modeEnBtn = document.getElementById('mode-en');
    modeZhBtn = document.getElementById('mode-zh');
    modeSentenceBtn = document.getElementById('mode-sentence');
    modeArticleBtn = document.getElementById('mode-article');
    modeCodeBtn = document.getElementById('mode-code');
    achievementDiv = document.getElementById('achievement');
    leaderboardList = document.getElementById('leaderboard-list');
    newsCountSpan = document.getElementById('news-count');
    scoreSpan = document.getElementById('score');
    autoShowEncodingCheckbox = document.getElementById('auto-show-encoding');
    virtualKeyboard = document.getElementById('virtual-keyboard');

    // 3. 綁定事件處理器
    updateLoadingStatus('綁定事件處理器...');
    if (modeEnBtn) modeEnBtn.onclick = () => switchMode('en');
    if (modeZhBtn) modeZhBtn.onclick = () => switchMode('zh');
    if (modeSentenceBtn) modeSentenceBtn.onclick = () => switchContentMode('sentence');
    if (modeArticleBtn) modeArticleBtn.onclick = () => switchContentMode('article');
    if (modeCodeBtn) modeCodeBtn.onclick = () => switchContentMode('code');
    if (restartBtn) restartBtn.onclick = startGame;
    initCodeTypeControls();
    if (autoShowEncodingCheckbox) {
        autoShowEncodingCheckbox.onchange = (e) => toggleAutoShowEncoding(e.target.checked);
    }
    setupEventListeners();

    // 4. 載入編碼快取、設定和主題
    updateLoadingStatus('載入編碼快取...');
    loadEncodingCache();
    loadAutoShowEncodingSetting();
    loadTheme();
    initThemeControls();

    // 5. 載入字典資料
    updateLoadingStatus('載入字典資料...');
    await loadDictionary();
    console.log('Dictionary loaded.');

    // 6. 先用備用句子初始化（讓用戶可以立即開始）
    updateLoadingStatus('準備題庫...');
    initNewsWithFallback();
    updateNewsCount();

    // 7. 完成初始化
    updateLoadingStatus('初始化完成！');

    // 初始化虛擬鍵盤
    updateVirtualKeyboard();
    updateVirtualKeyboardVisibility();

    // 隱藏載入畫面並開始遊戲
    setTimeout(() => {
        hideLoadingOverlay();
        startGame();
    }, 200);

    // 8. 背景載入今日新聞（不阻塞）
    loadTodayNewsInBackground();
}

// ===== 遊戲邏輯 =====

function generateRandomCodeSequence(length = 30) {
    const codeSet = CODE_CHARACTERS[codeType];
    if (!codeSet) return '';

    const chars = codeSet.chars;
    let sequence = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        sequence += chars[randomIndex];
    }

    return sequence;
}

function getRandomPassage() {
    // 字碼模式：生成隨機字碼序列
    if (contentMode === 'code') {
        return generateRandomCodeSequence(30);
    }

    // 根據內容模式選擇資料來源
    let dataSource;
    if (contentMode === 'article') {
        dataSource = articleData[currentMode];
    } else {
        dataSource = newsData[currentMode];
    }

    if (!dataSource || dataSource.length === 0) {
        console.warn(`No ${contentMode} data available for mode:`, currentMode);
        return '';
    }

    if (dataSource.length === 1) {
        const item = dataSource[0];
        // 文章模式返回 content，句子模式返回字串本身
        return contentMode === 'article' ? item.content : item;
    }

    let newIndex;
    let attempts = 0;
    const oldPassage = currentPassage;

    do {
        newIndex = Math.floor(Math.random() * dataSource.length);
        const newPassage = contentMode === 'article' ? dataSource[newIndex].content : dataSource[newIndex];
        if (newPassage !== oldPassage || attempts >= 20) break;
        attempts++;
    } while (true);

    console.log(`Picked ${contentMode} index ${newIndex} of ${dataSource.length}`);
    const item = dataSource[newIndex];
    return contentMode === 'article' ? item.content : item;
}

function startGame() {
    currentPassage = getRandomPassage();
    startTime = null;
    errorCount = 0;
    isTestComplete = false;
    previousCorrectCount = 0;  // 重置正確字符數量追蹤

    // 更新新聞數量顯示
    updateNewsCount();

    // 更新虛擬鍵盤可見性
    updateVirtualKeyboardVisibility();

    renderPassage();

    inputArea.value = '';
    inputArea.disabled = false;
    inputArea.placeholder = currentMode === 'zh' ? '開始輸入...' : 'Start typing...';
    inputArea.focus();

    resultsDiv.classList.add('hidden');
    restartBtn.classList.add('hidden');

    // 如果啟用自動顯示編碼且在中文模式，則顯示第一個字符的編碼
    if (autoShowEncoding && currentMode === 'zh') {
        showEncodingHint();
    } else {
        hideEncodingHint();
    }
}

function renderPassage() {
    textDisplay.innerHTML = currentPassage
        .split('')
        .map((char, index) => `<span class="char" data-index="${index}">${char}</span>`)
        .join('');
    charSpans = textDisplay.querySelectorAll('.char');
}

function updateDisplay(inputText) {
    const chars = charSpans;
    let newErrorCount = 0;

    chars.forEach((charSpan, index) => {
        charSpan.classList.remove('correct', 'incorrect', 'current');

        if (index < inputText.length) {
            if (inputText[index] === currentPassage[index]) {
                charSpan.classList.add('correct');
            } else {
                charSpan.classList.add('incorrect');
                newErrorCount++;
            }
        } else if (index === inputText.length) {
            charSpan.classList.add('current');
        }
    });

    errorCount = newErrorCount;
}

function calculateWPM(correctChars, elapsedTimeMs) {
    const minutes = elapsedTimeMs / 60000;
    if (minutes === 0) return 0;

    if (currentMode === 'zh') {
        // 中文 WPM: 正確字數 / 分鐘
        return Math.round(correctChars / minutes);
    } else {
        // 英文 WPM: (正確字數 / 5) / 分鐘
        return Math.round((correctChars / 5) / minutes);
    }
}

function calculateAccuracy(totalPassageLength, correctChars) {
    if (totalPassageLength === 0) return 100;
    // 以全句為基準，沒打的字就是錯的
    return Math.round((correctChars / totalPassageLength) * 100);
}

function completeTest() {
    isTestComplete = true;
    const endTime = Date.now();

    // 防止未開始就結束導致的 elapsedTime 異常
    const elapsedTime = startTime ? (endTime - startTime) : 0;

    // 計算真正打對的字數（逐字比對最後的輸入結果）
    const inputText = inputArea.value;
    let correctChars = 0;
    for (let i = 0; i < Math.min(inputText.length, currentPassage.length); i++) {
        if (inputText[i] === currentPassage[i]) {
            correctChars++;
        }
    }

    // 使用新的邏輯計算成績
    const wpm = calculateWPM(correctChars, elapsedTime);
    const accuracy = calculateAccuracy(currentPassage.length, correctChars);
    const score = wpm * accuracy;

    wpmSpan.textContent = wpm;
    accuracySpan.textContent = accuracy;
    if (scoreSpan) scoreSpan.textContent = score;

    // 更新排行榜並檢查成就
    const result = updateLeaderboard(wpm, accuracy, score);
    showAchievement(result);
    renderLeaderboard(result.currentRank);

    inputArea.disabled = true;
    resultsDiv.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    hideEncodingHint();
    if (virtualKeyboard) virtualKeyboard.classList.add('hidden');
}

// ===== 排行榜功能 =====

function getLeaderboardKey() {
    return currentMode === 'zh' ? STORAGE_KEYS.LEADERBOARD_ZH : STORAGE_KEYS.LEADERBOARD_EN;
}

function getLeaderboard() {
    let data = loadFromStorage(getLeaderboardKey());
    if (!data) return [];

    // 補全舊紀錄的分數，確保排序一致
    return data.map(entry => {
        if (entry.score === undefined) {
            entry.score = entry.wpm * entry.accuracy;
        }
        return entry;
    });
}

function saveLeaderboard(leaderboard) {
    saveToStorage(getLeaderboardKey(), leaderboard);
}

function updateLeaderboard(wpm, accuracy, score) {
    const leaderboard = getLeaderboard();
    const now = new Date();
    const timestamp = now.toLocaleString('zh-TW');

    const newEntry = { wpm, accuracy, score, timestamp };

    // 檢查是否破紀錄（新的最高分數）
    // 由於 getLeaderboard 已補全 score，這裡可以直接比較
    const isNewRecord = leaderboard.length === 0 || score > leaderboard[0].score;

    // 加入新紀錄
    leaderboard.push(newEntry);

    // 按分數排序（高到低）
    leaderboard.sort((a, b) => b.score - a.score);

    // 找到當前成績的排名
    const currentRank = leaderboard.findIndex(e => e === newEntry) + 1;

    // 只保留前五名
    const topFive = leaderboard.slice(0, 5);

    // 檢查是否進入前五名
    const isTopFive = currentRank <= 5;

    saveLeaderboard(topFive);

    return { isNewRecord, isTopFive, currentRank };
}

function showAchievement(result) {
    achievementDiv.classList.remove('hidden');

    if (result.isNewRecord) {
        achievementDiv.innerHTML = '🎉 <strong>新紀錄！</strong> 你創造了新的最高分數！';
        achievementDiv.className = 'achievement new-record';
    } else if (result.isTopFive) {
        achievementDiv.innerHTML = `🏅 <strong>進入前五名！</strong> 目前排名第 ${result.currentRank} 名`;
        achievementDiv.className = 'achievement top-five';
    } else {
        achievementDiv.innerHTML = `目前排名第 ${result.currentRank} 名，繼續加油！`;
        achievementDiv.className = 'achievement';
    }
}

function renderLeaderboard(currentRank) {
    const leaderboard = getLeaderboard();

    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<li class="empty">尚無紀錄</li>';
        return;
    }

    leaderboardList.innerHTML = leaderboard.map((entry, index) => {
        const rank = index + 1;
        const isCurrentResult = rank === currentRank;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

        return `<li class="${isCurrentResult ? 'current' : ''}">
            ${medal} <strong>${entry.score || (entry.wpm * entry.accuracy)}</strong> 分 
            <span class="detail">(${entry.wpm} WPM / ${entry.accuracy}%)</span>
            <span class="timestamp">${entry.timestamp}</span>
            ${isCurrentResult ? '<span class="current-badge">← 本次</span>' : ''}
        </li>`;
    }).join('');
}

// ===== 編碼提示 =====

function getCurrentChar() {
    const inputLength = inputArea.value.length;
    if (inputLength < currentPassage.length) {
        return currentPassage[inputLength];
    }
    return null;
}

async function showEncodingHint() {
    // 字碼模式不顯示拆碼框（改用虛擬鍵盤提示）
    if (contentMode === 'code') {
        hideEncodingHint();
        return;
    }

    const inputText = inputArea.value;

    // 計算實際已正確輸入的字符數量（作為當前位置）
    let correctCount = 0;
    for (let i = 0; i < Math.min(inputText.length, currentPassage.length); i++) {
        if (inputText[i] === currentPassage[i]) {
            correctCount++;
        } else {
            break; // 遇到第一個錯誤就停止計數
        }
    }

    const currentIndex = correctCount;

    if (currentIndex >= currentPassage.length) return;

    const char = currentPassage[currentIndex];

    // 檢查是否為中文字元
    if (!isChinese(char)) {
        hintChar.textContent = char;
        hintZhuyin.textContent = '非中文';
        hintCangjie.textContent = '非中文';
        hintBoshiamy.textContent = '非中文';
        hintPinyin.textContent = '非中文';
        encodingHint.classList.remove('hidden');
        return;
    }

    hintChar.textContent = char;

    // 先顯示查詢中狀態
    hintZhuyin.textContent = '查詢中...';
    hintCangjie.textContent = '查詢中...';
    hintBoshiamy.textContent = '查詢中...';
    hintPinyin.textContent = '查詢中...';
    encodingHint.classList.remove('hidden');

    // 取得編碼資料（支援非同步）
    // 如果字典還在載入中，這裡會等到 fetchEncodingForChar 檢查到 dictionaryData 有值，
    // 或者直接去線上查（視 fetchEncodingForChar 實作而定）。
    // 為了確保字典優先，我們可以在這裡做個簡單判斷或直接呼叫。
    const encoding = await fetchEncodingForChar(char);

    if (encoding) {
        hintZhuyin.textContent = encoding.zhuyin || '無資料';
        hintCangjie.textContent = encoding.cangjie || '無資料';
        hintBoshiamy.textContent = encoding.boshiamy || '無資料';
        // 移除拼音聲調數字，顯示實際輸入格式
        hintPinyin.textContent = removePinyinTone(encoding.pinyin) || '無資料';
    } else {
        hintZhuyin.textContent = '查無資料';
        hintCangjie.textContent = '查無資料';
        hintBoshiamy.textContent = '查無資料';
        hintPinyin.textContent = '查無資料';
    }
}

function hideEncodingHint() {
    encodingHint.classList.add('hidden');
}

// ===== 模式切換 =====

function switchMode(mode) {
    currentMode = mode;

    if (mode === 'zh') {
        modeZhBtn.classList.add('active');
        modeEnBtn.classList.remove('active');
    } else {
        modeEnBtn.classList.add('active');
        modeZhBtn.classList.remove('active');
    }

    // 更新字碼類型顯示
    updateCodeTypeVisibility();

    // 如果在字碼模式，根據語言更新字碼類型
    if (contentMode === 'code') {
        if (mode === 'en') {
            codeType = 'english';
        } else if (codeType === 'english') {
            codeType = 'cangjie';
        }
    }

    updateVirtualKeyboard();
    startGame();
}

function switchContentMode(mode) {
    contentMode = mode;

    // 按鈕狀態更新
    modeSentenceBtn.classList.toggle('active', mode === 'sentence');
    modeArticleBtn.classList.toggle('active', mode === 'article');
    modeCodeBtn.classList.toggle('active', mode === 'code');

    // CSS 類別更新
    textDisplay.classList.toggle('article-mode', mode === 'article');
    textDisplay.classList.toggle('code-mode', mode === 'code');
    inputArea.classList.toggle('article-mode', mode === 'article');
    inputArea.classList.toggle('code-mode', mode === 'code');

    // 顯示/隱藏字碼類型選擇器
    updateCodeTypeVisibility();

    if (mode === 'code') {
        // 字碼模式下禁用自動完成
        inputArea.setAttribute('autocomplete', 'off');
        inputArea.setAttribute('autocorrect', 'off');
        inputArea.setAttribute('autocapitalize', 'off');
        inputArea.setAttribute('spellcheck', 'false');

        // 根據語言設定字碼類型
        if (currentMode === 'en') {
            codeType = 'english';
        } else if (codeType === 'english') {
            // 如果是中文但 codeType 還是 english，改為 cangjie
            codeType = 'cangjie';
        }
    } else {
        inputArea.removeAttribute('autocomplete');
        inputArea.removeAttribute('autocorrect');
        inputArea.removeAttribute('autocapitalize');
        inputArea.removeAttribute('spellcheck');
    }

    updateNewsCount();
    updateEncodingLabel();
    updateVirtualKeyboardVisibility();
    updateVirtualKeyboard();
    startGame();
}

function updateCodeTypeVisibility() {
    const codeTypeSection = document.getElementById('code-type-section');
    if (!codeTypeSection) return;

    // 只有在字碼模式 + 中文語言時才顯示字碼類型選擇
    if (contentMode === 'code' && currentMode === 'zh') {
        codeTypeSection.classList.remove('hidden');
    } else {
        codeTypeSection.classList.add('hidden');
    }
}

function switchCodeType(type) {
    codeType = type;

    // 更新按鈕狀態
    document.querySelectorAll('#code-type-controls .mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.codeType === type);
    });

    // 更新虛擬鍵盤並重新開始遊戲
    updateVirtualKeyboard();
    startGame();
}

function initCodeTypeControls() {
    document.querySelectorAll('#code-type-controls .mode-btn').forEach(btn => {
        btn.onclick = () => switchCodeType(btn.dataset.codeType);
    });
}

// ===== 字碼模式按鍵處理 =====

function handleCodeKeypress(key) {
    // 清除上次的鍵盤高亮
    clearKeyboardHighlights();

    // 啟動計時器
    if (startTime === null) {
        startTime = Date.now();
    }

    // Backspace: 刪除最後一個字符
    if (key === 'Backspace') {
        if (inputArea.value.length > 0) {
            inputArea.value = inputArea.value.slice(0, -1);
            updateDisplay(inputArea.value);
            if (autoShowEncoding && codeType !== 'english') {
                showEncodingHint();
            }
        }
        return;
    }

    // 取得當前位置的預期字碼
    const currentIndex = inputArea.value.length;
    if (currentIndex >= currentPassage.length) {
        completeTest();
        return;
    }

    const expectedCode = currentPassage[currentIndex];
    const codeSet = CODE_CHARACTERS[codeType];

    // 判斷按鍵是否正確
    let pressedChar;
    if (codeSet.keyMap) {
        // 需要映射（注音、倉頡）
        pressedChar = codeSet.keyMap[key];
    } else {
        // 直接使用（英文）
        pressedChar = key.toLowerCase();
    }

    if (pressedChar === expectedCode) {
        // 正確：累加輸入並前進
        inputArea.value += expectedCode;
        updateDisplay(inputArea.value);

        // 顯示下一個字碼的編碼提示
        if (autoShowEncoding && codeType !== 'english') {
            showEncodingHint();
        }

        // 檢查是否完成
        if (inputArea.value.length >= currentPassage.length) {
            completeTest();
        }
    } else if (pressedChar !== undefined) {
        // 錯誤：增加錯誤計數但不前進
        errorCount++;
        flashError();
        highlightKeyboardError(key, getPhysicalKeyForCode(expectedCode));
    }
}

function flashError() {
    // 視覺錯誤回饋
    const currentIndex = inputArea.value.length;
    const chars = charSpans;
    if (chars[currentIndex]) {
        chars[currentIndex].classList.add('flash-error');
        setTimeout(() => {
            chars[currentIndex].classList.remove('flash-error');
        }, 300);
    }
}

// ===== 虛擬鍵盤 =====

function updateVirtualKeyboard() {
    if (!virtualKeyboard) return;
    const codeSet = CODE_CHARACTERS[codeType];
    const keys = virtualKeyboard.querySelectorAll('.kb-key');
    keys.forEach(keyEl => {
        const physicalKey = keyEl.dataset.key;
        const codeSpan = keyEl.querySelector('.kb-code');
        if (!codeSpan) return;
        if (codeType === 'english') {
            codeSpan.textContent = /^[a-z]$/.test(physicalKey) ? physicalKey.toUpperCase() : '';
        } else if (codeSet.keyMap) {
            codeSpan.textContent = codeSet.keyMap[physicalKey] || '';
        } else {
            codeSpan.textContent = '';
        }
    });
}

function updateVirtualKeyboardVisibility() {
    if (!virtualKeyboard) return;
    if (contentMode === 'code' && autoShowEncoding) {
        virtualKeyboard.classList.remove('hidden');
    } else {
        virtualKeyboard.classList.add('hidden');
    }
}

function updateEncodingLabel() {
    if (!autoShowEncodingCheckbox) return;
    const label = autoShowEncodingCheckbox.parentElement;
    if (!label) return;
    label.lastChild.textContent = contentMode === 'code' ? ' 持續顯示鍵盤' : ' 持續顯示中文拆碼';
}

function getPhysicalKeyForCode(codeChar) {
    const codeSet = CODE_CHARACTERS[codeType];
    if (codeType === 'english') {
        return codeChar.toLowerCase();
    }
    if (codeSet.keyMap) {
        for (const [physKey, mappedChar] of Object.entries(codeSet.keyMap)) {
            if (mappedChar === codeChar) return physKey;
        }
    }
    return null;
}

function clearKeyboardHighlights() {
    if (!virtualKeyboard) return;
    virtualKeyboard.querySelectorAll('.kb-wrong').forEach(el => el.classList.remove('kb-wrong'));
    virtualKeyboard.querySelectorAll('.kb-correct').forEach(el => el.classList.remove('kb-correct'));
}

function highlightKeyboardError(pressedKey, expectedKey) {
    if (!virtualKeyboard) return;
    clearKeyboardHighlights();
    const wrongKeyEl = virtualKeyboard.querySelector(`.kb-key[data-key="${CSS.escape(pressedKey)}"]`);
    const correctKeyEl = expectedKey ? virtualKeyboard.querySelector(`.kb-key[data-key="${CSS.escape(expectedKey)}"]`) : null;
    if (wrongKeyEl) wrongKeyEl.classList.add('kb-wrong');
    if (correctKeyEl) correctKeyEl.classList.add('kb-correct');
}

// ===== 事件監聯 =====

function setupEventListeners() {
    inputArea.addEventListener('input', (e) => {
        if (isTestComplete || contentMode === 'code') return;  // 字碼模式跳過

        const inputText = e.target.value;

        if (startTime === null && inputText.length > 0) {
            startTime = Date.now();
        }

        updateDisplay(inputText);

        // 如果啟用自動顯示編碼且在中文模式
        if (autoShowEncoding && currentMode === 'zh') {
            // 計算當前正確輸入的字符數量
            let correctCount = 0;
            for (let i = 0; i < Math.min(inputText.length, currentPassage.length); i++) {
                if (inputText[i] === currentPassage[i]) {
                    correctCount++;
                } else {
                    break;
                }
            }

            // 只有當正確字符數量增加時，才更新編碼提示
            if (correctCount > previousCorrectCount) {
                showEncodingHint();
            }

            previousCorrectCount = correctCount;
        }
    });

    document.addEventListener('keydown', (e) => {
        // 只有在 focus 在輸入框或測試已完成時才攔截按鍵
        const isInputActive = document.activeElement === inputArea;

        // 字碼模式的按鍵處理
        if (contentMode === 'code' && !isTestComplete && isInputActive) {
            // 特殊鍵處理
            if (e.key === 'Tab') {
                e.preventDefault();
                showEncodingHint();
                return;
            }
            if (e.key === 'Escape') {
                completeTest();
                return;
            }
            if (e.key === 'Enter') {
                return;  // 字碼模式忽略 Enter
            }

            // 一般按鍵處理
            if (e.key.length === 1 || e.key === 'Backspace') {
                e.preventDefault();
                handleCodeKeypress(e.key);
            }
            return;
        }

        // 原有的按鍵處理（句子/文章模式）
        if (e.key === 'Tab') {
            if (isInputActive && !isTestComplete) {
                e.preventDefault();
                showEncodingHint();
            }
        }

        if (e.key === 'Escape') {
            if (isInputActive && !isTestComplete && startTime !== null) {
                completeTest();
            }
        }

        if (e.key === 'Enter') {
            // 如果測試已完成，按 Enter 重新開始
            if (isTestComplete) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Restarting game via Enter');
                startGame();
                return;
            }

            // 如果測試進行中且已輸入完成（最後一字正確），按 Enter 結束
            if (!isTestComplete && inputArea.value.length >= currentPassage.length) {
                const inputText = inputArea.value;
                const targetLen = currentPassage.length;
                if (inputText[targetLen - 1] === currentPassage[targetLen - 1]) {
                    e.preventDefault();
                    e.stopPropagation();
                    completeTest();
                    return;
                }
            }
        }

        if (e.key === ' ') {
            // 如果測試已完成，按空白鍵重新開始
            if (isTestComplete) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Restarting game via Space');
                startGame();
            }
        }
    }, true);
}

// 舊的事件綁定已移除，改在 bootstrap 內執行


// ===== DEBUG 工具函式 (可從 console 呼叫) =====

// 測試 daily_news.json 載入
async function testLoadJSON() {
    console.log('=== Testing daily_news.json load ===');
    try {
        const response = await fetch(`daily_news.json?t=${Date.now()}`);
        console.log('Response:', response);
        const data = await response.json();
        console.log('Data:', data);
        console.log('ZH count:', data.zh.length);
        console.log('EN count:', data.en.length);
        console.log('Articles ZH count:', data.articles_zh.length);
        console.log('Articles EN count:', data.articles_en.length);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// 檢查當前資料狀態
function checkData() {
    console.log('=== Current Data Status ===');
    console.log('newsData.zh:', newsData.zh.length, 'items');
    console.log('newsData.en:', newsData.en.length, 'items');
    console.log('articleData.zh:', articleData.zh.length, 'items');
    console.log('articleData.en:', articleData.en.length, 'items');
    console.log('Current mode:', currentMode);
    console.log('Content mode:', contentMode);
    console.log('First 3 zh items:', newsData.zh.slice(0, 3));
}

// 強制清除快取並重新載入
function forceReload() {
    console.log('=== Force Reload ===');
    localStorage.removeItem(STORAGE_KEYS.DATA_VERSION);
    localStorage.removeItem(STORAGE_KEYS.NEWS_DATE);
    localStorage.removeItem(STORAGE_KEYS.NEWS_ZH);
    localStorage.removeItem(STORAGE_KEYS.NEWS_EN);
    console.log('Cache cleared, reloading...');
    location.reload();
}

// 啟動應用程式 (等待 DOM 載入完成)
document.addEventListener('DOMContentLoaded', () => {
    // 重新抓取一次 DOM 元素以防萬一
    const statusEl = document.getElementById('loading-status');
    if (statusEl) console.log('Loading status element found');
    else console.error('Loading status element NOT found!');

    console.log('=== DEBUG Functions Available ===');
    console.log('testLoadJSON() - 測試載入 daily_news.json');
    console.log('checkData() - 檢查當前資料狀態');
    console.log('forceReload() - 強制清除快取並重新載入');
    console.log('================================');

    bootstrap();
});
