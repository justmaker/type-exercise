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
    NEWS_DATE: 'typing_news_date',
    NEWS_ZH: 'typing_news_zh',
    NEWS_EN: 'typing_news_en',
    ENCODING_CACHE: 'typing_encoding_cache',
    LEADERBOARD_ZH: 'typing_leaderboard_zh',
    LEADERBOARD_EN: 'typing_leaderboard_en'
};
// 字典資料 (從 dictionary-data.js 預載入，或從 dictionary.json 動態載入)
// 格式: { char: { zhuyin, cangjie, boshiamy, pinyin } }
// 注意: 如果 dictionary-data.js 已載入，dictionaryData 會被覆蓋
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
let currentPassage = '';
let startTime = null;
let errorCount = 0;
let isTestComplete = false;

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
const achievementDiv = document.getElementById('achievement');
const leaderboardList = document.getElementById('leaderboard-list');
const newsCountSpan = document.getElementById('news-count');

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

// 預先查詢單一字元編碼並快取
async function prefetchEncodingForChar(char) {
    // 已有資料就跳過（優先檢查 dictionary.json）
    if (dictionaryData[char] || persistentEncodingCache[char] || (typeof encodingData !== 'undefined' && encodingData[char])) {
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

// 檢查並載入今日新聞
async function loadTodayNews() {
    // 如果是 file:// 協議，直接使用備用句子（避免 fetch 卡住）
    if (window.location.protocol === 'file:') {
        console.log('Running locally (file://), using fallback sentences');
        newsData.zh = FALLBACK_SENTENCES.zh;
        newsData.en = FALLBACK_SENTENCES.en;
        return true;
    }

    const today = getTodayString();
    const savedDate = loadFromStorage(STORAGE_KEYS.NEWS_DATE);

    // 如果已是今日資料，直接從 localStorage 載入
    if (savedDate === today) {
        const savedZh = loadFromStorage(STORAGE_KEYS.NEWS_ZH);
        const savedEn = loadFromStorage(STORAGE_KEYS.NEWS_EN);

        // 如果快取內容存在且數量足夠（避免舊的 5 條快取干擾）
        if (savedZh && savedZh.length >= 10 && savedEn && savedEn.length >= 10) {
            newsData.zh = savedZh;
            newsData.en = savedEn;
            console.log('Loaded news from localStorage cache');
            return true;
        }
    }

    // 優先嘗試載入 Python 後端生成的 daily_news.json
    updateLoadingStatus('載入每日新聞...');
    try {
        // 加入時間戳記避免快取
        const response = await fetch(`daily_news.json?t=${Date.now()}`);
        if (response.ok) {
            const data = await response.json();

            // 檢查日期是否為今天
            if (data.date === today && data.zh && data.en) {
                newsData.zh = data.zh;
                newsData.en = data.en;

                // 儲存到 localStorage
                saveToStorage(STORAGE_KEYS.NEWS_DATE, today);
                saveToStorage(STORAGE_KEYS.NEWS_ZH, newsData.zh);
                saveToStorage(STORAGE_KEYS.NEWS_EN, newsData.en);

                console.log('Loaded news from daily_news.json (Python backend)');
                return false;
            }
        }
    } catch (error) {
        console.warn('Failed to load daily_news.json, falling back to RSS:', error.message);
    }

    // 如果 daily_news.json 不存在或過期，嘗試從 RSS 抓取
    updateLoadingStatus('載入中文新聞...');
    const zhNews = await fetchNewsFromRSS('zh');

    updateLoadingStatus('載入英文新聞...');
    const enNews = await fetchNewsFromRSS('en');

    // 如果抓取失敗，使用備用文章
    newsData.zh = zhNews.length > 0 ? zhNews : FALLBACK_SENTENCES.zh;
    newsData.en = enNews.length > 0 ? enNews : FALLBACK_SENTENCES.en;

    // 儲存到 localStorage
    saveToStorage(STORAGE_KEYS.NEWS_DATE, today);
    saveToStorage(STORAGE_KEYS.NEWS_ZH, newsData.zh);
    saveToStorage(STORAGE_KEYS.NEWS_EN, newsData.en);

    console.log('Loaded news from RSS feeds');
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

    // 載入 dictionary.json（完整字典，包含倉頡、無蝦米等）
    updateLoadingStatus('載入字典資料...');
    await loadDictionary();

    // 載入今日新聞
    const hadCache = await loadTodayNews();

    if (!hadCache) {
        // 預先查詢所有編碼
        updateLoadingStatus('預先載入編碼資料...');
        await prefetchAllEncodings([...newsData.zh, ...newsData.en]);
    }

    // 更新新聞數量顯示
    if (newsCountSpan) {
        newsCountSpan.textContent = newsData[currentMode].length;
    }

    // 隱藏載入畫面
    hideLoadingOverlay();

    // 開始遊戲
    startGame();
}

// ===== 遊戲邏輯 =====

function getRandomPassage() {
    const passages = newsData[currentMode];
    if (!passages || passages.length === 0) {
        console.warn('No news data available for mode:', currentMode);
        return '';
    }

    if (passages.length === 1) return passages[0];

    let newIndex;
    let attempts = 0;
    const oldPassage = currentPassage;

    do {
        newIndex = Math.floor(Math.random() * passages.length);
        attempts++;
    } while (passages[newIndex] === oldPassage && attempts < 20);

    console.log(`Picked news index ${newIndex} of ${passages.length}`);
    return passages[newIndex];
}

function startGame() {
    currentPassage = getRandomPassage();
    startTime = null;
    errorCount = 0;
    isTestComplete = false;

    // 更新新聞數量顯示
    if (newsCountSpan) {
        newsCountSpan.textContent = newsData[currentMode].length;
    }

    renderPassage();

    inputArea.value = '';
    inputArea.disabled = false;
    inputArea.placeholder = currentMode === 'zh' ? '開始輸入...' : 'Start typing...';
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

    // 更新排行榜並檢查成就
    const result = updateLeaderboard(wpm, accuracy);
    showAchievement(result);
    renderLeaderboard(result.currentRank);

    inputArea.disabled = true;
    resultsDiv.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    hideEncodingHint();
}

// ===== 排行榜功能 =====

function getLeaderboardKey() {
    return currentMode === 'zh' ? STORAGE_KEYS.LEADERBOARD_ZH : STORAGE_KEYS.LEADERBOARD_EN;
}

function getLeaderboard() {
    const data = loadFromStorage(getLeaderboardKey());
    return data || [];
}

function saveLeaderboard(leaderboard) {
    saveToStorage(getLeaderboardKey(), leaderboard);
}

function updateLeaderboard(wpm, accuracy) {
    const leaderboard = getLeaderboard();
    const now = new Date();
    const timestamp = now.toLocaleString('zh-TW');

    const newEntry = { wpm, accuracy, timestamp };

    // 檢查是否破紀錄（新的最高 WPM）
    const isNewRecord = leaderboard.length === 0 || wpm > leaderboard[0].wpm;

    // 加入新紀錄
    leaderboard.push(newEntry);

    // 按 WPM 排序（高到低）
    leaderboard.sort((a, b) => b.wpm - a.wpm);

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
        achievementDiv.innerHTML = '🎉 <strong>新紀錄！</strong> 你創造了新的最高 WPM！';
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
            ${medal} <strong>${entry.wpm}</strong> WPM (${entry.accuracy}%) 
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
});

document.addEventListener('keydown', (e) => {
    // 只有在 focus 在輸入框或測試已完成時才攔截按鍵
    const isInputActive = document.activeElement === inputArea;

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

modeEnBtn.addEventListener('click', () => switchMode('en'));
modeZhBtn.addEventListener('click', () => switchMode('zh'));
restartBtn.addEventListener('click', startGame);

// 啟動應用程式
bootstrap();
