// Google News RSS URLs
const RSS_URLS = {
    zh: 'https://news.google.com/rss?hl=zh-TW&gl=TW&ceid=TW:zh-Hant',
    en: 'https://news.google.com/rss?hl=en&gl=US&ceid=US:en'
};

// CORS Proxy
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// 每種語言抓取的新聞數量
const NEWS_COUNT = 3;

// localStorage keys
const STORAGE_KEYS = {
    NEWS_DATE: 'typing_news_date',
    NEWS_ZH: 'typing_news_zh',
    NEWS_EN: 'typing_news_en',
    ENCODING_CACHE: 'typing_encoding_cache'
};

// 當前模式 ('zh' 或 'en')
let currentMode = 'zh';
let currentPassage = '';
let startTime = null;
let errorCount = 0;
let isTestComplete = false;

// 新聞資料（從 localStorage 載入）
let newsData = {
    zh: [],
    en: []
};

// 編碼快取（持久化）
let persistentEncodingCache = {};

// DOM 元素
const loadingOverlay = document.getElementById('loading-overlay');
const loadingStatus = document.getElementById('loading-status');
const textDisplay = document.getElementById('text-display');
const inputArea = document.getElementById('input-area');
const resultsDiv = document.getElementById('results');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');
const modeEnBtn = document.getElementById('mode-en');
const modeZhBtn = document.getElementById('mode-zh');

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

// 取得編碼（同步，從快取或本地資料庫）
function getCachedEncoding(char) {
    // 先檢查持久化快取
    if (persistentEncodingCache[char]) {
        return persistentEncodingCache[char];
    }
    // 再檢查本地資料庫
    if (typeof encodingData !== 'undefined' && encodingData[char]) {
        return encodingData[char];
    }
    return null;
}

// 預先查詢單一字元編碼並快取
async function prefetchEncodingForChar(char) {
    // 已有資料就跳過
    if (persistentEncodingCache[char] || (typeof encodingData !== 'undefined' && encodingData[char])) {
        return;
    }

    try {
        const response = await fetch(`https://www.moedict.tw/uni/${char}.json`);
        if (response.ok) {
            const data = await response.json();
            const encoding = {
                zhuyin: data.heteronyms?.[0]?.bopomofo || '無資料',
                pinyin: data.heteronyms?.[0]?.pinyin || '無資料',
                cangjie: '無資料',
                boshiamy: '無資料'
            };
            persistentEncodingCache[char] = encoding;
        }
    } catch (error) {
        console.error(`編碼查詢失敗 (${char}):`, error);
    }
}

// 預先查詢所有中文字元的編碼
async function prefetchAllEncodings(texts) {
    const allText = texts.join('');
    const chineseChars = [...new Set(allText.split('').filter(isChinese))];

    // 找出需要查詢的字元
    const charsToFetch = chineseChars.filter(char =>
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

// 檢查並載入今日新聞
async function loadTodayNews() {
    const today = getTodayString();
    const savedDate = loadFromStorage(STORAGE_KEYS.NEWS_DATE);

    // 如果已是今日資料，直接從 localStorage 載入
    if (savedDate === today) {
        const savedZh = loadFromStorage(STORAGE_KEYS.NEWS_ZH);
        const savedEn = loadFromStorage(STORAGE_KEYS.NEWS_EN);

        if (savedZh && savedZh.length > 0 && savedEn && savedEn.length > 0) {
            newsData.zh = savedZh;
            newsData.en = savedEn;
            return true;
        }
    }

    // 需要重新抓取
    updateLoadingStatus('載入中文新聞...');
    const zhNews = await fetchNewsFromRSS('zh');

    updateLoadingStatus('載入英文新聞...');
    const enNews = await fetchNewsFromRSS('en');

    // 如果抓取失敗，使用備用文章
    newsData.zh = zhNews.length > 0 ? zhNews : [
        "科技發展日新月異，人工智慧正在改變我們的生活方式。",
        "全球氣候變遷議題持續受到國際社會高度關注。",
        "經濟市場波動劇烈，投資人應謹慎評估風險。"
    ];

    newsData.en = enNews.length > 0 ? enNews : [
        "Technology continues to evolve rapidly, transforming how we live and work.",
        "Global markets show mixed signals amid economic uncertainty worldwide.",
        "Scientists make breakthrough discoveries in renewable energy research."
    ];

    // 儲存到 localStorage
    saveToStorage(STORAGE_KEYS.NEWS_DATE, today);
    saveToStorage(STORAGE_KEYS.NEWS_ZH, newsData.zh);
    saveToStorage(STORAGE_KEYS.NEWS_EN, newsData.en);

    return false;
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
    updateLoadingStatus('檢查快取資料...');

    // 載入編碼快取
    loadEncodingCache();

    // 載入今日新聞
    const hadCache = await loadTodayNews();

    if (!hadCache) {
        // 預先查詢所有編碼
        updateLoadingStatus('預先載入編碼資料...');
        await prefetchAllEncodings([...newsData.zh, ...newsData.en]);
    }

    updateLoadingStatus('準備完成！');

    // 隱藏載入畫面
    hideLoadingOverlay();

    // 開始遊戲
    startGame();
}

// ===== 遊戲邏輯 =====

function getRandomPassage() {
    const passages = newsData[currentMode];
    return passages[Math.floor(Math.random() * passages.length)];
}

function startGame() {
    currentPassage = getRandomPassage();
    startTime = null;
    errorCount = 0;
    isTestComplete = false;

    renderPassage();

    inputArea.value = '';
    inputArea.disabled = false;
    inputArea.placeholder = currentMode === 'zh' ? '開始輸入...' : 'Start typing here...';
    inputArea.focus();

    resultsDiv.classList.add('hidden');
    restartBtn.classList.add('hidden');
    hideEncodingHint();
}

function renderPassage() {
    textDisplay.innerHTML = currentPassage
        .split('')
        .map((char, index) => `<span class="char" data-index="${index}">${char}</span>`)
        .join('');
}

function updateDisplay(inputText) {
    const chars = textDisplay.querySelectorAll('.char');
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

function calculateWPM(charactersTyped, elapsedTimeMs) {
    const minutes = elapsedTimeMs / 60000;
    if (minutes === 0) return 0;
    return Math.round((charactersTyped / 5) / minutes);
}

function calculateAccuracy(totalChars, errors) {
    if (totalChars === 0) return 100;
    const correctChars = totalChars - errors;
    return Math.round((correctChars / totalChars) * 100);
}

function completeTest() {
    isTestComplete = true;
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    const wpm = calculateWPM(currentPassage.length, elapsedTime);
    const accuracy = calculateAccuracy(currentPassage.length, errorCount);

    wpmSpan.textContent = wpm;
    accuracySpan.textContent = accuracy;

    inputArea.disabled = true;
    resultsDiv.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    hideEncodingHint();
}

// ===== 編碼提示 =====

function getCurrentChar() {
    const inputLength = inputArea.value.length;
    if (inputLength < currentPassage.length) {
        return currentPassage[inputLength];
    }
    return null;
}

function showEncodingHint() {
    const char = getCurrentChar();
    if (!char) {
        hideEncodingHint();
        return;
    }

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

    // 取得編碼資料（同步，從快取）
    const encoding = getCachedEncoding(char);

    hintChar.textContent = char;

    if (encoding) {
        hintZhuyin.textContent = encoding.zhuyin || '無資料';
        hintCangjie.textContent = encoding.cangjie || '無資料';
        hintBoshiamy.textContent = encoding.boshiamy || '無資料';
        hintPinyin.textContent = encoding.pinyin || '無資料';
    } else {
        hintZhuyin.textContent = '無資料';
        hintCangjie.textContent = '無資料';
        hintBoshiamy.textContent = '無資料';
        hintPinyin.textContent = '無資料';
    }

    encodingHint.classList.remove('hidden');
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

    startGame();
}

// ===== 事件監聽 =====

inputArea.addEventListener('input', (e) => {
    if (isTestComplete) return;

    const inputText = e.target.value;

    if (startTime === null && inputText.length > 0) {
        startTime = Date.now();
    }

    updateDisplay(inputText);
    hideEncodingHint();

    if (inputText.length >= currentPassage.length) {
        completeTest();
    }
});

inputArea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        if (!isTestComplete) {
            showEncodingHint();
        }
    }
});

modeEnBtn.addEventListener('click', () => switchMode('en'));
modeZhBtn.addEventListener('click', () => switchMode('zh'));
restartBtn.addEventListener('click', startGame);

// 啟動應用程式
bootstrap();
