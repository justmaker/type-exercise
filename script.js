const passages = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice.",
    "Programming is the art of telling a computer what to do. It requires patience, logic, and creativity to solve problems effectively.",
    "Practice makes perfect. The more you type, the faster and more accurate you will become. Keep practicing every day.",
    "Technology has transformed how we live and work. From smartphones to artificial intelligence, innovation continues to shape our future."
];

let currentPassage = '';
let startTime = null;
let errorCount = 0;
let isTestComplete = false;

const textDisplay = document.getElementById('text-display');
const inputArea = document.getElementById('input-area');
const resultsDiv = document.getElementById('results');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

function init() {
    currentPassage = passages[Math.floor(Math.random() * passages.length)];
    startTime = null;
    errorCount = 0;
    isTestComplete = false;

    renderPassage();

    inputArea.value = '';
    inputArea.disabled = false;
    inputArea.focus();

    resultsDiv.classList.add('hidden');
    restartBtn.classList.add('hidden');
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
}

inputArea.addEventListener('input', (e) => {
    if (isTestComplete) return;

    const inputText = e.target.value;

    if (startTime === null && inputText.length > 0) {
        startTime = Date.now();
    }

    updateDisplay(inputText);

    if (inputText.length >= currentPassage.length) {
        completeTest();
    }
});

restartBtn.addEventListener('click', init);

init();
