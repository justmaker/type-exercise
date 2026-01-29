// 英文文章
const englishPassages = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice.",
    "Programming is the art of telling a computer what to do. It requires patience, logic, and creativity to solve problems effectively.",
    "Practice makes perfect. The more you type, the faster and more accurate you will become. Keep practicing every day.",
    "Technology has transformed how we live and work. From smartphones to artificial intelligence, innovation continues to shape our future."
];

// 中文文章
const chinesePassages = [
    "天下沒有白吃的午餐，想要有所成就就必須付出努力。每一分耕耘都會有一分收穫，只要堅持不懈，終將達成目標。",
    "學習是一輩子的事情，不論年紀多大都應該保持好奇心。知識就是力量，讓我們一起努力學習，不斷進步。",
    "時間是最公平的，每個人每天都只有二十四小時。如何善用時間，決定了我們能夠走多遠。珍惜當下，把握機會。",
    "科技改變了我們的生活方式，從智慧型手機到人工智慧，創新持續塑造著我們的未來。讓我們一起擁抱變化。",
    "打字練習可以提高工作效率，熟練的打字技巧是現代人必備的能力。每天練習一點，進步看得見。"
];

// 當前模式 ('zh' 或 'en')
let currentMode = 'zh';
let currentPassage = '';
let startTime = null;
let errorCount = 0;
let isTestComplete = false;

// DOM 元素
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

function init() {
    const passages = currentMode === 'zh' ? chinesePassages : englishPassages;
    currentPassage = passages[Math.floor(Math.random() * passages.length)];
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

// 取得當前待輸入的字元
function getCurrentChar() {
    const inputLength = inputArea.value.length;
    if (inputLength < currentPassage.length) {
        return currentPassage[inputLength];
    }
    return null;
}

// 顯示編碼提示
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

    // 取得編碼資料
    const encoding = getEncoding(char);

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

// 隱藏編碼提示
function hideEncodingHint() {
    encodingHint.classList.add('hidden');
}

// 切換模式
function switchMode(mode) {
    currentMode = mode;

    // 更新按鈕狀態
    if (mode === 'zh') {
        modeZhBtn.classList.add('active');
        modeEnBtn.classList.remove('active');
    } else {
        modeEnBtn.classList.add('active');
        modeZhBtn.classList.remove('active');
    }

    // 重新初始化
    init();
}

// 輸入事件
inputArea.addEventListener('input', (e) => {
    if (isTestComplete) return;

    const inputText = e.target.value;

    if (startTime === null && inputText.length > 0) {
        startTime = Date.now();
    }

    updateDisplay(inputText);

    // 輸入時隱藏編碼提示
    hideEncodingHint();

    if (inputText.length >= currentPassage.length) {
        completeTest();
    }
});

// Tab 鍵事件 - 顯示編碼提示
inputArea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault(); // 阻止預設的 Tab 行為
        if (!isTestComplete) {
            showEncodingHint();
        }
    }
});

// 模式切換按鈕事件
modeEnBtn.addEventListener('click', () => switchMode('en'));
modeZhBtn.addEventListener('click', () => switchMode('zh'));

// 重新開始按鈕事件
restartBtn.addEventListener('click', init);

// 初始化
init();
