#!/usr/bin/env python3
"""
Daily News Fetcher for Typing Game
Fetches RSS feeds, sanitizes HTML, normalizes punctuation to full-width.
Supports both title-only mode and full article mode.
Enhanced to fetch 100 technology articles per language with 2026 focus.
"""

import feedparser
from bs4 import BeautifulSoup
import json
import re
import requests
from datetime import datetime
from typing import List, Dict, Optional
from urllib.parse import urlparse
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# RSS Feed URLs - Multiple sources for better coverage
RSS_FEEDS = {
    'zh': [
        'https://news.google.com/rss?hl=zh-TW&gl=TW&ceid=TW:zh-Hant',
        'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtcDZHZ0pVVnlnQVAB?hl=zh-TW&gl=TW&ceid=TW:zh-Hant',  # Tech topic
    ],
    'en': [
        'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
        'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',  # Tech topic
    ]
}

# Number of news items to fetch per language
NEWS_COUNT = 20

# Number of full articles to fetch (increased to 100)
ARTICLE_COUNT = 100

# Maximum articles to attempt (since some will fail)
MAX_ATTEMPTS = 250

# Request timeout
REQUEST_TIMEOUT = 10

# User agent for requests
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'

# Technology keywords for filtering
TECH_KEYWORDS_ZH = [
    '科技', 'AI', '人工智慧', '機器學習', '深度學習', '神經網路',
    '軟體', '程式', '開發', '編程', '程式碼', 'app', '應用',
    '晶片', '處理器', '半導體', 'CPU', 'GPU',
    '網路', '資安', '駭客', '加密', '區塊鏈',
    '雲端', '數據', '大數據', '演算法',
    '手機', '電腦', '筆電', '平板', '裝置',
    'iPhone', 'Android', 'Windows', 'Mac', 'Linux',
    'Google', 'Apple', 'Microsoft', 'Meta', 'Amazon',
    '物聯網', '5G', '6G', 'VR', 'AR', '元宇宙',
    '量子', '機器人', '自動駕駛', '電動車',
]

TECH_KEYWORDS_EN = [
    'tech', 'technology', 'AI', 'artificial intelligence', 'machine learning',
    'deep learning', 'neural network', 'software', 'programming', 'developer',
    'code', 'app', 'application', 'chip', 'processor', 'semiconductor',
    'CPU', 'GPU', 'network', 'cybersecurity', 'hacker', 'encryption',
    'blockchain', 'cloud', 'data', 'big data', 'algorithm',
    'smartphone', 'computer', 'laptop', 'tablet', 'device',
    'iPhone', 'Android', 'Windows', 'Mac', 'Linux',
    'Google', 'Apple', 'Microsoft', 'Meta', 'Amazon',
    'IoT', '5G', '6G', 'VR', 'AR', 'metaverse',
    'quantum', 'robot', 'autonomous', 'self-driving', 'electric vehicle',
]


def normalize_punctuation(text: str) -> str:
    """Convert half-width punctuation to full-width."""
    replacements = {
        ',': '，',
        '.': '。',
        '?': '？',
        '!': '！',
        ':': '：',
        ';': '；',
        '(': '（',
        ')': '）',
    }
    
    for half, full in replacements.items():
        text = text.replace(half, full)
    
    return text


def strip_html(html_text: str) -> str:
    """Remove all HTML tags and get clean text."""
    soup = BeautifulSoup(html_text, 'html.parser')
    return soup.get_text()


def clean_whitespace(text: str) -> str:
    """Remove excessive whitespace and newlines."""
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text


def is_tech_related(title: str, content: str, lang: str) -> bool:
    """Check if article is technology-related based on keywords."""
    text = (title + ' ' + content).lower()
    keywords = TECH_KEYWORDS_ZH if lang == 'zh' else TECH_KEYWORDS_EN

    # Count keyword matches
    matches = sum(1 for keyword in keywords if keyword.lower() in text)

    # Consider it tech-related if at least 2 keywords match
    return matches >= 2


def follow_google_news_redirect(google_url: str) -> Optional[str]:
    """Follow Google News redirect to get the actual article URL."""
    try:
        headers = {'User-Agent': USER_AGENT}
        response = requests.head(google_url, headers=headers, allow_redirects=True, timeout=REQUEST_TIMEOUT)
        return response.url
    except Exception as e:
        print(f"  ⚠ Redirect failed: {e}")
        return None


def extract_article_content(url: str, lang: str) -> Optional[str]:
    """Extract main article content from a news URL."""
    try:
        headers = {'User-Agent': USER_AGENT}
        response = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        # Remove unwanted elements
        for tag in soup.find_all(['script', 'style', 'nav', 'header', 'footer',
                                   'aside', 'iframe', 'noscript', 'form']):
            tag.decompose()

        # Try to find article content using common selectors
        content = None

        # Common article content selectors
        selectors = [
            'article',
            '[class*="article-content"]',
            '[class*="article-body"]',
            '[class*="story-body"]',
            '[class*="post-content"]',
            '[class*="entry-content"]',
            '.content',
            'main',
        ]

        for selector in selectors:
            element = soup.select_one(selector)
            if element:
                # Get all paragraph text
                paragraphs = element.find_all('p')
                if paragraphs:
                    content = ' '.join(p.get_text().strip() for p in paragraphs if p.get_text().strip())
                    if len(content) > 200:  # Minimum content length
                        break

        if not content:
            # Fallback: get all paragraphs from body
            paragraphs = soup.find_all('p')
            content = ' '.join(p.get_text().strip() for p in paragraphs if len(p.get_text().strip()) > 50)

        if content:
            content = clean_whitespace(content)
            if lang == 'zh':
                content = normalize_punctuation(content)

            # Limit content length for typing practice (around 500-1000 chars)
            if len(content) > 1000:
                # Try to cut at sentence boundary
                cut_point = content.rfind('。', 0, 1000)
                if cut_point == -1:
                    cut_point = content.rfind('. ', 0, 1000)
                if cut_point == -1:
                    cut_point = 1000
                content = content[:cut_point + 1]

            return content if len(content) >= 100 else None

        return None

    except Exception as e:
        print(f"  ⚠ Content extraction failed: {e}")
        return None


def fetch_single_article(entry: Dict, lang: str) -> Optional[Dict]:
    """Fetch a single article (for parallel processing)."""
    try:
        title = entry.get('title', '')
        link = entry.get('link', '')

        if not title or not link:
            return None

        # Clean title
        title = strip_html(title)
        title = title.split(' - ')[0].strip()
        if lang == 'zh':
            title = normalize_punctuation(title)
        title = clean_whitespace(title)

        if len(title) < 10:
            return None

        # Follow redirect to get actual URL
        actual_url = follow_google_news_redirect(link)
        if not actual_url:
            return None

        # Extract article content
        content = extract_article_content(actual_url, lang)
        if not content:
            return None

        # Check if tech-related
        if not is_tech_related(title, content, lang):
            return None

        return {
            'title': title,
            'content': content,
            'url': actual_url
        }

    except Exception as e:
        return None


def fetch_full_articles(lang: str, count: int = ARTICLE_COUNT) -> List[Dict]:
    """Fetch full article content from multiple RSS feeds with parallel processing."""
    feed_urls = RSS_FEEDS.get(lang, [])
    if not feed_urls:
        raise ValueError(f"Unknown language: {lang}")

    # Convert single URL to list for backward compatibility
    if isinstance(feed_urls, str):
        feed_urls = [feed_urls]

    print(f"  Fetching from {len(feed_urls)} RSS feeds...")

    # Collect all entries from all feeds
    all_entries = []
    for feed_url in feed_urls:
        try:
            feed = feedparser.parse(feed_url)
            all_entries.extend(feed.entries)
            print(f"    Found {len(feed.entries)} entries")
        except Exception as e:
            print(f"    ⚠ Feed error: {e}")
            continue

    print(f"  Total entries collected: {len(all_entries)}")
    print(f"  Processing up to {MAX_ATTEMPTS} articles to get {count} tech articles...")

    # Limit to MAX_ATTEMPTS
    entries_to_process = all_entries[:MAX_ATTEMPTS]

    # Use ThreadPoolExecutor for parallel fetching
    articles = []
    completed = 0

    with ThreadPoolExecutor(max_workers=10) as executor:
        # Submit all tasks
        future_to_entry = {
            executor.submit(fetch_single_article, entry, lang): entry
            for entry in entries_to_process
        }

        # Process completed tasks
        for future in as_completed(future_to_entry):
            completed += 1
            if len(articles) >= count:
                # Cancel remaining tasks
                for f in future_to_entry:
                    f.cancel()
                break

            try:
                result = future.result()
                if result:
                    articles.append(result)
                    print(f"    ✓ [{len(articles)}/{count}] {result['title'][:50]}... ({len(result['content'])} chars)")
            except Exception as e:
                pass

            # Progress update every 20 articles
            if completed % 20 == 0:
                print(f"    Progress: {completed}/{len(entries_to_process)} processed, {len(articles)} tech articles found")

    print(f"  Final: {len(articles)} tech articles collected")
    return articles[:count]


def fetch_news_titles(lang: str, count: int = NEWS_COUNT) -> List[str]:
    """Fetch and clean news titles from RSS feeds."""
    feed_urls = RSS_FEEDS.get(lang, [])
    if not feed_urls:
        raise ValueError(f"Unknown language: {lang}")

    # Convert single URL to list for backward compatibility
    if isinstance(feed_urls, str):
        feed_urls = [feed_urls]

    titles = []

    try:
        for feed_url in feed_urls:
            if len(titles) >= count:
                break

            feed = feedparser.parse(feed_url)

            for entry in feed.entries:
                if len(titles) >= count:
                    break

                title = entry.get('title', '')
                if not title:
                    continue

                title = strip_html(title)
                title = title.split(' - ')[0].strip()

                if lang == 'zh':
                    title = normalize_punctuation(title)

                title = clean_whitespace(title)

                # Basic tech filtering for titles
                keywords = TECH_KEYWORDS_ZH if lang == 'zh' else TECH_KEYWORDS_EN
                has_tech_keyword = any(keyword.lower() in title.lower() for keyword in keywords)

                if len(title) >= 15 and has_tech_keyword:
                    titles.append(title)

        return titles

    except Exception as e:
        print(f"Error fetching {lang} news: {e}")
        return []


def fetch_daily_news(include_articles: bool = True) -> Dict:
    """Fetch news for both languages and return as JSON-ready dict."""
    today = datetime.now().strftime('%Y-%m-%d')

    # Fetch titles (for sentence mode)
    print("\n📰 Fetching news titles...")
    zh_news = fetch_news_titles('zh')
    en_news = fetch_news_titles('en')

    if not zh_news:
        zh_news = [
            '人工智慧技術在2026年持續突破，深度學習模型變得更加強大。',
            '量子電腦研究取得重大進展，運算能力達到新高峰。',
            '新一代晶片技術問世，處理器效能提升三倍以上。',
            '雲端運算市場持續擴大，企業數位轉型加速進行。',
            '自動駕駛技術日益成熟，智慧交通系統逐步普及。',
            '虛擬實境和擴增實境技術融合，開創全新應用場景。',
            '網路安全威脅升級，企業加強資安防護措施。',
            '區塊鏈技術應用擴展，數位資產管理更加便利。',
            '5G網路全面覆蓋，6G技術研發取得階段性成果。',
            '機器學習演算法優化，人工智慧更加智能化。'
        ]

    if not en_news:
        en_news = [
            'Artificial intelligence breakthroughs continue in 2026 with more powerful deep learning models.',
            'Quantum computing research achieves major milestones in computational power.',
            'Next-generation chip technology emerges with triple the processing performance.',
            'Cloud computing market expands as enterprises accelerate digital transformation.',
            'Autonomous driving technology matures with smart transportation systems.',
            'Virtual and augmented reality technologies merge creating new applications.',
            'Cybersecurity threats escalate prompting stronger enterprise protection measures.',
            'Blockchain technology applications expand with improved digital asset management.',
            '5G networks achieve full coverage while 6G research reaches key milestones.',
            'Machine learning algorithms optimize making artificial intelligence smarter.'
        ]

    result = {
        'date': today,
        'zh': zh_news,
        'en': en_news
    }

    # Fetch full articles (for article mode)
    if include_articles:
        print("\n📄 Fetching full articles (Chinese)...")
        zh_articles = fetch_full_articles('zh')

        print("\n📄 Fetching full articles (English)...")
        en_articles = fetch_full_articles('en')

        # Fallback articles (tech-focused for 2026)
        if not zh_articles or len(zh_articles) < 5:
            fallback_zh = [
                {
                    'title': '2026年人工智慧技術的突破性進展',
                    'content': '人工智慧技術在2026年持續突破創新。深度學習模型的參數規模達到前所未有的水平，神經網路架構更加複雜精巧。從語音辨識到自然語言處理，從電腦視覺到自動駕駛，AI正在改變我們生活的方方面面。大型語言模型展現出驚人的理解和生成能力，能夠處理更複雜的任務。專家預測，人工智慧將會更深入地融入我們的日常生活，帶來更多便利的同時，也將帶來新的倫理和社會挑戰。各國政府和科技公司都在加大AI研發投入，競爭日益激烈。'
                },
                {
                    'title': '量子電腦突破傳統運算極限',
                    'content': '量子電腦技術在2026年取得重大突破，運算能力達到新的里程碑。研究團隊成功開發出擁有一千個量子位元的穩定系統，錯誤率大幅降低。量子演算法的應用範圍不斷擴展，從密碼學到藥物設計，從金融建模到氣候預測，都展現出巨大潛力。多家科技巨頭投入大量資源開發商用量子電腦，預計將在未來幾年內實現商業化應用。量子電腦的發展也帶來新的安全挑戰，傳統加密方法可能面臨威脅，促使研究人員開發量子安全加密技術。'
                },
                {
                    'title': '新世代晶片技術革新半導體產業',
                    'content': '半導體產業在2026年迎來重大技術革新。新一代三奈米製程晶片正式量產，電晶體密度再創新高，功耗降低百分之四十。異質整合技術成熟，將不同功能的晶片封裝在一起，大幅提升系統效能。3D堆疊技術突破瓶頸，記憶體頻寬提升數倍。AI專用晶片效能持續增長，神經網路處理器架構不斷優化。各國加強半導體自主研發能力，供應鏈安全成為戰略重點。材料科學的進步為下一代晶片技術奠定基礎，石墨烯和碳奈米管等新材料展現應用前景。'
                },
                {
                    'title': '雲端運算與邊緣運算加速數位轉型',
                    'content': '雲端運算市場在2026年持續快速增長，企業數位轉型全面加速。混合雲架構成為主流，企業可以靈活地在公有雲和私有雲之間調配資源。容器化和微服務架構普及，應用程式部署更加靈活高效。邊緣運算技術日益成熟，在物聯網設備上進行即時數據處理，降低延遲和頻寬需求。無伺服器運算模式受到青睞，開發者只需專注於程式碼邏輯，無需管理底層基礎設施。雲端安全技術不斷強化，零信任架構逐步推廣。多雲管理工具幫助企業優化資源使用和成本控制。'
                },
                {
                    'title': '網路安全威脅升級推動防護技術創新',
                    'content': '2026年網路安全形勢日益嚴峻，攻擊手段更加複雜多樣。人工智慧被應用於攻擊和防禦兩端，AI驅動的惡意軟體能夠自動調整策略繞過防護，而AI安全系統也在即時偵測和應對威脅。勒索軟體攻擊持續增加，目標從個人擴展到企業和關鍵基礎設施。零信任安全架構成為企業標準配置，不再假設內網環境安全。量子加密技術開始部署，為未來量子電腦威脅做好準備。生物識別和多因素認證普及，密碼管理方式改變。安全意識培訓受到重視，人為因素仍是最大安全漏洞。'
                }
            ]
            zh_articles = fallback_zh if not zh_articles else zh_articles + fallback_zh[:5 - len(zh_articles)]

        if not en_articles or len(en_articles) < 5:
            fallback_en = [
                {
                    'title': 'Breakthrough Advances in Artificial Intelligence in 2026',
                    'content': 'Artificial intelligence technology continues to break new ground in 2026. Deep learning models have reached unprecedented parameter scales with increasingly sophisticated neural network architectures. From speech recognition to natural language processing, from computer vision to autonomous driving, AI is transforming every aspect of our lives. Large language models demonstrate remarkable understanding and generation capabilities, handling more complex tasks than ever before. Experts predict that artificial intelligence will become even more deeply integrated into our daily lives, bringing new conveniences alongside ethical and social challenges. Governments and tech companies worldwide are increasing AI research investments, with competition intensifying rapidly.'
                },
                {
                    'title': 'Quantum Computing Breaks Traditional Computational Limits',
                    'content': 'Quantum computing technology achieved major breakthroughs in 2026, reaching new milestones in computational power. Research teams successfully developed stable systems with one thousand qubits, significantly reducing error rates. The application scope of quantum algorithms continues to expand, from cryptography to drug design, from financial modeling to climate prediction, demonstrating enormous potential. Multiple tech giants are investing heavily in developing commercial quantum computers, expected to achieve commercialization within the next few years. The development of quantum computing also brings new security challenges, as traditional encryption methods may face threats, prompting researchers to develop quantum-safe cryptography.'
                },
                {
                    'title': 'Next-Generation Chip Technology Revolutionizes Semiconductor Industry',
                    'content': 'The semiconductor industry welcomed major technological innovations in 2026. New generation three-nanometer process chips entered mass production, with transistor density reaching new highs and power consumption reduced by forty percent. Heterogeneous integration technology matured, packaging chips with different functions together and dramatically improving system performance. 3D stacking technology broke through bottlenecks, multiplying memory bandwidth. AI-specific chip performance continues to grow with constantly optimized neural network processor architectures. Countries are strengthening semiconductor self-sufficiency capabilities, making supply chain security a strategic priority. Advances in materials science lay the foundation for next-generation chip technology, with graphene and carbon nanotubes showing application promise.'
                },
                {
                    'title': 'Cloud and Edge Computing Accelerate Digital Transformation',
                    'content': 'The cloud computing market continued rapid growth in 2026 as enterprise digital transformation fully accelerated. Hybrid cloud architectures became mainstream, allowing enterprises to flexibly allocate resources between public and private clouds. Containerization and microservices architectures proliferated, making application deployment more flexible and efficient. Edge computing technology matured, enabling real-time data processing on IoT devices while reducing latency and bandwidth requirements. Serverless computing models gained favor, allowing developers to focus solely on code logic without managing underlying infrastructure. Cloud security technologies continuously strengthened with zero-trust architectures gradually spreading. Multi-cloud management tools help enterprises optimize resource usage and cost control.'
                },
                {
                    'title': 'Escalating Cybersecurity Threats Drive Defense Innovation',
                    'content': 'The cybersecurity situation in 2026 became increasingly severe with attack methods growing more complex and diverse. Artificial intelligence is being applied to both attack and defense, with AI-driven malware automatically adjusting strategies to bypass protections, while AI security systems detect and respond to threats in real-time. Ransomware attacks continued to increase, with targets expanding from individuals to enterprises and critical infrastructure. Zero-trust security architectures became standard enterprise configurations, no longer assuming internal network safety. Quantum encryption technology began deployment, preparing for future quantum computer threats. Biometric and multi-factor authentication proliferated, changing password management practices. Security awareness training gained attention, as human factors remain the biggest security vulnerability.'
                }
            ]
            en_articles = fallback_en if not en_articles else en_articles + fallback_en[:5 - len(en_articles)]

        result['articles_zh'] = zh_articles
        result['articles_en'] = en_articles

    return result


def main():
    """Main function: fetch news and save to JSON file."""
    print("🚀 Fetching 2026 technology news...")
    print(f"   Target: {ARTICLE_COUNT} articles per language")
    print(f"   This may take 10-30 minutes depending on network speed...\n")

    start_time = time.time()
    news_data = fetch_daily_news(include_articles=True)
    elapsed = time.time() - start_time

    output_file = 'daily_news.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Saved to {output_file}")
    print(f"  Date: {news_data['date']}")
    print(f"  Time elapsed: {elapsed:.1f} seconds")
    print(f"  Chinese titles: {len(news_data['zh'])} items")
    print(f"  English titles: {len(news_data['en'])} items")
    print(f"  Chinese articles: {len(news_data.get('articles_zh', []))} items")
    print(f"  English articles: {len(news_data.get('articles_en', []))} items")

    # Calculate statistics
    if news_data.get('articles_zh'):
        zh_avg_len = sum(len(a['content']) for a in news_data['articles_zh']) / len(news_data['articles_zh'])
        print(f"  Average Chinese article length: {zh_avg_len:.0f} characters")

    if news_data.get('articles_en'):
        en_avg_len = sum(len(a['content']) for a in news_data['articles_en']) / len(news_data['articles_en'])
        print(f"  Average English article length: {en_avg_len:.0f} characters")

    print("\n📝 Preview (Chinese titles):")
    for i, title in enumerate(news_data['zh'][:3], 1):
        print(f"  {i}. {title}")

    if news_data.get('articles_zh'):
        print("\n📄 Preview (Chinese article):")
        article = news_data['articles_zh'][0]
        print(f"  Title: {article['title']}")
        print(f"  Content: {article['content'][:100]}...")

    print("\n📝 Preview (English titles):")
    for i, title in enumerate(news_data['en'][:3], 1):
        print(f"  {i}. {title}")

    if news_data.get('articles_en'):
        print("\n📄 Preview (English article):")
        article = news_data['articles_en'][0]
        print(f"  Title: {article['title']}")
        print(f"  Content: {article['content'][:100]}...")


if __name__ == '__main__':
    main()
