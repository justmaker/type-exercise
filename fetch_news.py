#!/usr/bin/env python3
"""
Daily News Fetcher for Typing Game
Fetches RSS feeds, sanitizes HTML, normalizes punctuation to full-width.
Supports both title-only mode and full article mode.
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

# RSS Feed URLs
RSS_FEEDS = {
    'zh': 'https://news.google.com/rss?hl=zh-TW&gl=TW&ceid=TW:zh-Hant',
    'en': 'https://news.google.com/rss?hl=en&gl=US&ceid=US:en'
}

# Number of news items to fetch per language
NEWS_COUNT = 20

# Number of full articles to fetch (fewer due to longer fetch time)
ARTICLE_COUNT = 5

# Request timeout
REQUEST_TIMEOUT = 10

# User agent for requests
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'


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


def fetch_full_articles(lang: str, count: int = ARTICLE_COUNT) -> List[Dict]:
    """Fetch full article content from RSS feed."""
    url = RSS_FEEDS.get(lang)
    if not url:
        raise ValueError(f"Unknown language: {lang}")

    try:
        feed = feedparser.parse(url)
        articles = []

        for entry in feed.entries:
            if len(articles) >= count:
                break

            title = entry.get('title', '')
            link = entry.get('link', '')

            if not title or not link:
                continue

            # Clean title
            title = strip_html(title)
            title = title.split(' - ')[0].strip()
            if lang == 'zh':
                title = normalize_punctuation(title)
            title = clean_whitespace(title)

            if len(title) < 10:
                continue

            print(f"  Fetching: {title[:40]}...")

            # Follow redirect to get actual URL
            actual_url = follow_google_news_redirect(link)
            if not actual_url:
                continue

            # Extract article content
            content = extract_article_content(actual_url, lang)
            if content:
                articles.append({
                    'title': title,
                    'content': content,
                    'url': actual_url
                })
                print(f"    ✓ Got {len(content)} chars")

            # Be nice to servers
            time.sleep(0.5)

        return articles

    except Exception as e:
        print(f"Error fetching {lang} articles: {e}")
        return []


def fetch_news_titles(lang: str, count: int = NEWS_COUNT) -> List[str]:
    """Fetch and clean news titles from RSS feed."""
    url = RSS_FEEDS.get(lang)
    if not url:
        raise ValueError(f"Unknown language: {lang}")
    
    try:
        feed = feedparser.parse(url)
        
        titles = []
        for entry in feed.entries[:count * 2]:
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
            
            if len(title) >= 15:
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
            '科技發展日新月異，人工智慧正在改變我們的生活方式。',
            '全球暖化問題日益嚴重，各國紛紛提出減碳目標。',
            '教育是國家發展的根本，培養人才是最重要的投資。',
            '健康飲食和規律運動是維持身體健康的不二法門。',
            '閱讀能夠開拓視野，增進知識，培養獨立思考能力。'
        ]

    if not en_news:
        en_news = [
            'Technology advances rapidly, transforming how we live and work.',
            'Climate change poses significant challenges to global communities.',
            'Education empowers individuals and drives economic growth.',
            'Regular exercise and balanced nutrition promote well-being.',
            'Reading expands horizons and cultivates critical thinking.'
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

        # Fallback articles
        if not zh_articles:
            zh_articles = [{
                'title': '人工智慧的發展與未來',
                'content': '人工智慧技術近年來取得了突破性的進展。從語音辨識到自然語言處理，從電腦視覺到自動駕駛，AI正在改變我們生活的方方面面。專家預測，未來十年內，人工智慧將會更深入地融入我們的日常生活，帶來更多便利的同時，也將帶來新的挑戰和機遇。'
            }]

        if not en_articles:
            en_articles = [{
                'title': 'The Future of Artificial Intelligence',
                'content': 'Artificial intelligence has made remarkable progress in recent years. From speech recognition to natural language processing, from computer vision to autonomous driving, AI is transforming every aspect of our lives. Experts predict that in the next decade, artificial intelligence will become even more integrated into our daily routines, bringing both new conveniences and challenges.'
            }]

        result['articles_zh'] = zh_articles
        result['articles_en'] = en_articles

    return result


def main():
    """Main function: fetch news and save to JSON file."""
    print("🚀 Fetching daily news...")

    news_data = fetch_daily_news(include_articles=True)

    output_file = 'daily_news.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Saved to {output_file}")
    print(f"  Date: {news_data['date']}")
    print(f"  Chinese titles: {len(news_data['zh'])} items")
    print(f"  English titles: {len(news_data['en'])} items")
    print(f"  Chinese articles: {len(news_data.get('articles_zh', []))} items")
    print(f"  English articles: {len(news_data.get('articles_en', []))} items")

    print("\n📝 Preview (Chinese titles):")
    for i, title in enumerate(news_data['zh'][:3], 1):
        print(f"  {i}. {title}")

    if news_data.get('articles_zh'):
        print("\n📄 Preview (Chinese article):")
        article = news_data['articles_zh'][0]
        print(f"  Title: {article['title']}")
        print(f"  Content: {article['content'][:100]}...")


if __name__ == '__main__':
    main()
