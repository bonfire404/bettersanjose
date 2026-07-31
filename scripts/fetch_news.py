#!/usr/bin/env python3
"""
Official LGU & Multi-Outlet 24-Hour Web News Fetcher for San Jose, Antique.
Crawls and aggregates news & official LGU announcements from the Official San Jose de Buenavista LGU Facebook Page
(https://www.facebook.com/sanjosedbantique), Philippine Information Agency (PIA), PNA, Brigada News, and news outlets.
Runs automatically every 6 hours via GitHub Actions.
Uses standard library modules only.
"""

import email.utils
import json
import os
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

DEFAULT_IMAGES = {
    "governance": "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "default": "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
}

IGNORE_TITLE_PATTERNS = [
    r"^about\b", r"^posts\b", r"^category\b", r"^bnfm\b", r"^privacy policy\b", r"^contact us\b",
    r"antique shop", r"antique store", r"antique mall", r"antique finds", r"lufkin", r"texas", r"california", r"florida"
]

NON_PHILIPPINE_LOCATIONS = [
    "texas", "lufkin", "california", "florida", "ohio", "michigan", "pennsylvania",
    "tacloban", "occidental mindoro", "oriental mindoro", "nueva ecija", "del monte",
    "camarines", "batangas", "dinagat", "surigao", "zamboanga", "davao", "bulacan", "tarlac"
]

def clean_html(text: str) -> str:
    if not text:
        return ""
    clean = re.sub(r"<[^>]+>", " ", text)
    clean = urllib.parse.unquote(clean)
    clean = re.sub(r"&[a-zA-Z0-9#]+;", " ", clean)
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean

def is_junk_title(title: str) -> bool:
    title_lower = title.lower()
    for pattern in IGNORE_TITLE_PATTERNS:
        if re.search(pattern, title_lower):
            return True
    return len(title.split()) < 3

def is_philippines_antique(title: str, summary: str) -> bool:
    text = f"{title} {summary}".lower()
    for loc in NON_PHILIPPINE_LOCATIONS:
        if loc in text:
            return False

    has_antique = "antique" in text or "buenavista" in text or "visayas" in text or "sanjosedbantique" in text
    has_philippines = (
        "philippines" in text or "pna" in text or "pia" in text or "lgu" in text or
        "san jose" in text or "panay" in text or "brigada" in text or "pbbm" in text or
        "facebook" in text or "official" in text
    )
    return has_antique and has_philippines

def parse_pub_date(pub_date_str: str) -> tuple[datetime, int]:
    try:
        dt = email.utils.parsedate_to_datetime(pub_date_str)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        else:
            dt = dt.astimezone(timezone.utc)
        return dt, int(dt.timestamp())
    except Exception:
        now = datetime.now(timezone.utc)
        return now, int(now.timestamp())

def fetch_rss_feed(feed_url: str, fallback_source: str) -> list:
    items = []
    try:
        req = urllib.request.Request(feed_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()

        root = ET.fromstring(xml_data)
        channel = root.find("channel")
        if channel is None:
            return items

        for item in channel.findall("item"):
            title_elem = item.find("title")
            link_elem = item.find("link")
            desc_elem = item.find("description")
            pub_elem = item.find("pubDate")
            source_elem = item.find("source")

            raw_title = clean_html(title_elem.text if title_elem is not None and title_elem.text else "")
            link = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
            summary = clean_html(desc_elem.text if desc_elem is not None and desc_elem.text else "")
            pub_date_str = pub_elem.text.strip() if pub_elem is not None and pub_elem.text else ""

            if not raw_title or not link or is_junk_title(raw_title):
                continue

            source_name = fallback_source
            if source_elem is not None and source_elem.text:
                source_name = source_elem.text.strip()
            elif " - " in raw_title:
                parts = raw_title.rsplit(" - ", 1)
                raw_title = parts[0].strip()
                source_name = parts[1].strip()

            if "facebook.com/sanjosedbantique" in link.lower() or "sanjosedbantique" in raw_title.lower():
                source_name = "LGU San Jose (Official FB)"

            title = raw_title

            if not is_philippines_antique(title, summary):
                continue

            pub_dt, timestamp = parse_pub_date(pub_date_str)

            items.append({
                "id": f"news-{abs(hash(link))}",
                "title": title,
                "summary": summary[:240] + ("..." if len(summary) > 240 else "") if summary else title,
                "excerpt": summary[:160] + ("..." if len(summary) > 160 else "") if summary else title,
                "content": summary if summary else title,
                "url": link,
                "sourceUrl": link,
                "publishedAt": pub_dt.isoformat(),
                "date": pub_dt.isoformat(),
                "timestamp": timestamp,
                "source": source_name,
                "category": "san-jose-official",
                "municipality": "San Jose",
                "imageUrl": DEFAULT_IMAGES["default"]
            })
    except Exception as exc:
        print(f"Warning: Failed to fetch RSS feed {feed_url}: {exc}")
    return items

def main():
    print("Starting Official San Jose LGU Facebook & Multi-Outlet News Crawler...")
    all_news = []

    # Queries including Official Facebook Page & Official Announcement Indexing
    queries = [
        ('site:facebook.com/sanjosedbantique', "LGU San Jose (Official FB)"),
        ('site:facebook.com "San Jose de Buenavista" Antique', "LGU San Jose (Official FB)"),
        ('site:brigadanews.ph Antique when:1d', "Brigada News Antique"),
        ('site:brigadanews.ph "San Jose" when:1d', "Brigada News Antique"),
        ('"San Jose" Antique news Philippines when:1d', "Web News"),
        ('"Antique province" news Philippines when:1d', "Regional News"),
        ('site:pia.gov.ph Antique when:2d', "PIA Antique"),
        ('site:pna.gov.ph Antique when:2d', "PNA Antique"),
        ('site:facebook.com/sanjosedbantique when:7d', "LGU San Jose (Official FB)"),
    ]

    for q_str, fallback_src in queries:
        encoded_query = urllib.parse.quote(q_str)
        gn_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-PH&gl=PH&ceid=PH:en"
        items = fetch_rss_feed(gn_url, fallback_src)
        all_news.extend(items)

    seen_urls = set()
    seen_titles = set()
    unique_news = []
    now_utc = datetime.now(timezone.utc)

    for item in all_news:
        norm_title = item["title"].lower()
        if item["url"] not in seen_urls and norm_title not in seen_titles:
            seen_urls.add(item["url"])
            seen_titles.add(norm_title)

            pub_dt = datetime.fromisoformat(item["publishedAt"])
            age_hours = (now_utc - pub_dt).total_seconds() / 3600
            item["age_hours"] = round(age_hours, 1)

            if age_hours <= 168.0:  # Within 7 days window max
                unique_news.append(item)

    # Sort strictly newest first
    unique_news.sort(key=lambda x: x["timestamp"], reverse=True)

    strictly_24h = [item for item in unique_news if item["age_hours"] <= 24.0]
    final_news = strictly_24h if len(strictly_24h) >= 3 else unique_news[:15]

    print(f"Total San Jose LGU & Philippine Antique articles fetched: {len(unique_news)}")
    print(f"Articles strictly within 24 hours: {len(strictly_24h)}")

    output_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "news.json")
    output_path = os.path.abspath(output_path)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_news, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved {len(final_news)} fresh San Jose LGU & news items to {output_path}")

if __name__ == "__main__":
    main()
