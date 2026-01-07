# fetcher.py
from playwright.sync_api import sync_playwright
import time, requests

def fetch_page(url, headless=True, wait_for=1000):
    """
    Fetches a web page using Playwright.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        page = browser.new_page()
        try:
            page.goto(url, timeout=60000)
            time.sleep(wait_for/1000)
            html = page.content()
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            html = None
        finally:
            browser.close()
    return html

def download_pdf(url, dest_path):
    """
    Downloads a PDF file from a URL.
    """
    try:
        r = requests.get(url, stream=True, timeout=60)
        r.raise_for_status()
        with open(dest_path, 'wb') as f:
            for chunk in r.iter_content(1024*8):
                f.write(chunk)
        return dest_path
    except Exception as e:
        print(f"Error downloading PDF {url}: {e}")
        return None
