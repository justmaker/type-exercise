#!/usr/bin/env python3
"""
Daily News Fetcher for Typing Game
Fetches RSS feeds, sanitizes HTML, normalizes punctuation to full-width.
"""

import feedparser
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from typing import List, Dict

# RSS Feed URLs
RSS_FEEDS = {
    'zh': 'https://news.google.com/rss?hl=zh-TW&gl=TW&ceid=TW:zh-Hant',
    'en': 'https://news.google.com/rss?hl=en&gl=US&ceid=US:en'
}

# Number of news items to fetch per language
NEWS_COUNT = 20


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


def fetch_daily_news() -> Dict:
    """Fetch news for both languages and return as JSON-ready dict."""
    today = datetime.now().strftime('%Y-%m-%d')
    
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
    
    return {
        'date': today,
        'zh': zh_news,
        'en': en_news
    }


def main():
    """Main function: fetch news and save to JSON file."""
    print("Fetching daily news...")
    
    news_data = fetch_daily_news()
    
    output_file = 'daily_news.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(news_data, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Saved to {output_file}")
    print(f"  Date: {news_data['date']}")
    print(f"  Chinese news: {len(news_data['zh'])} items")
    print(f"  English news: {len(news_data['en'])} items")
    
    print("\nPreview (Chinese):")
    for i, title in enumerate(news_data['zh'][:3], 1):
        print(f"  {i}. {title}")


if __name__ == '__main__':
    main()
