
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function testEscapeHTML() {
    const tests = [
        { input: '<script>alert(1)</script>', expected: '&lt;script&gt;alert(1)&lt;/script&gt;' },
        { input: 'Hello & World', expected: 'Hello &amp; World' },
        { input: '"Double Quotes"', expected: '&quot;Double Quotes&quot;' },
        { input: "'Single Quotes'", expected: '&#039;Single Quotes&#039;' },
        { input: 'Normal Text 123', expected: 'Normal Text 123' },
        { input: null, expected: '' },
        { input: undefined, expected: '' },
        { input: 42, expected: '42' }
    ];

    let passed = true;
    for (const test of tests) {
        const result = escapeHTML(test.input);
        if (result !== test.expected) {
            console.error(`Test Failed: input="${test.input}", expected="${test.expected}", got="${result}"`);
            passed = false;
        }
    }
    return passed;
}

function testRenderLeaderboardMock() {
    const leaderboard = [
        { score: 1000, wpm: 100, accuracy: 100, timestamp: '2023/10/27 <img src=x onerror=alert(1)>' }
    ];

    const output = leaderboard.map((entry, index) => {
        const rank = index + 1;
        const currentRank = 1;
        const isCurrentResult = rank === currentRank;
        const medal = '🥇';

        return `<li class="${isCurrentResult ? 'current' : ''}">
            ${medal} <strong>${escapeHTML(entry.score || (entry.wpm * entry.accuracy))}</strong> 分
            <span class="detail">(${escapeHTML(entry.wpm)} WPM / ${escapeHTML(entry.accuracy)}%)</span>
            <span class="timestamp">${escapeHTML(entry.timestamp)}</span>
            ${isCurrentResult ? '<span class="current-badge">← 本次</span>' : ''}
        </li>`;
    }).join('');

    if (output.includes('<img src=x onerror=alert(1)>')) {
        console.error('Test Failed: XSS payload not escaped in leaderboard output');
        return false;
    }
    if (!output.includes('&lt;img src=x onerror=alert(1)&gt;')) {
        console.error('Test Failed: XSS payload not correctly escaped in leaderboard output');
        return false;
    }
    return true;
}

if (testEscapeHTML() && testRenderLeaderboardMock()) {
    console.log('✅ All security fix verifications passed!');
    process.exit(0);
} else {
    console.error('❌ Some verifications failed!');
    process.exit(1);
}
