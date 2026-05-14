"""
OurLgaMoni Scraper — Uses Cloudflare Browser Rendering REST API
to crawl ourlgamoni.com and extract LGA names, chairman names,
and FAAC allocation amounts for all 774 LGAs.

Usage:
  python scrapers/ourlgamoni_scraper.py

Requires environment variables:
  CLOUDFLARE_ACCOUNT_ID  — Your Cloudflare account ID
  CLOUDFLARE_API_TOKEN   — API Token with Browser Rendering Edit permission
  SUPABASE_URL           — Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY — Service role key for write access
"""

import os
import sys
import json
import time
import requests
from dotenv import load_dotenv

# Fix Windows console encoding for Unicode output
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Ensure parent directory is in path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from writer import upsert_lga, insert_allocation, find_lga_by_name, upsert_state
from workers.html_parsers.ourlgamoni_parser import parse_lga_detail, parse_state_lga_list

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# ──────────────────────────────────────────────
# Cloudflare Browser Rendering Config
# ──────────────────────────────────────────────
CF_ACCOUNT_ID = os.environ.get('CLOUDFLARE_ACCOUNT_ID', '')
CF_API_TOKEN  = os.environ.get('CLOUDFLARE_API_TOKEN', '')
CF_BASE_URL   = f'https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/browser-rendering'

# All 37 Nigerian state slugs (36 states + FCT)
NIGERIAN_STATES = [
    {"name": "Abia",       "slug": "abia",       "code": "AB"},
    {"name": "Adamawa",    "slug": "adamawa",     "code": "AD"},
    {"name": "Akwa Ibom",  "slug": "akwa-ibom",   "code": "AK"},
    {"name": "Anambra",    "slug": "anambra",     "code": "AN"},
    {"name": "Bauchi",     "slug": "bauchi",      "code": "BA"},
    {"name": "Bayelsa",    "slug": "bayelsa",     "code": "BY"},
    {"name": "Benue",      "slug": "benue",       "code": "BE"},
    {"name": "Borno",      "slug": "borno",       "code": "BO"},
    {"name": "Cross River","slug": "cross-river",  "code": "CR"},
    {"name": "Delta",      "slug": "delta",       "code": "DE"},
    {"name": "Ebonyi",     "slug": "ebonyi",      "code": "EB"},
    {"name": "Edo",        "slug": "edo",         "code": "ED"},
    {"name": "Ekiti",      "slug": "ekiti",       "code": "EK"},
    {"name": "Enugu",      "slug": "enugu",       "code": "EN"},
    {"name": "Gombe",      "slug": "gombe",       "code": "GO"},
    {"name": "Imo",        "slug": "imo",         "code": "IM"},
    {"name": "Jigawa",     "slug": "jigawa",      "code": "JI"},
    {"name": "Kaduna",     "slug": "kaduna",      "code": "KD"},
    {"name": "Kano",       "slug": "kano",        "code": "KN"},
    {"name": "Katsina",    "slug": "katsina",     "code": "KT"},
    {"name": "Kebbi",      "slug": "kebbi",       "code": "KB"},
    {"name": "Kogi",       "slug": "kogi",        "code": "KG"},
    {"name": "Kwara",      "slug": "kwara",       "code": "KW"},
    {"name": "Lagos",      "slug": "lagos",       "code": "LA"},
    {"name": "Nasarawa",   "slug": "nasarawa",    "code": "NA"},
    {"name": "Niger",      "slug": "niger",       "code": "NI"},
    {"name": "Ogun",       "slug": "ogun",        "code": "OG"},
    {"name": "Ondo",       "slug": "ondo",        "code": "ON"},
    {"name": "Osun",       "slug": "osun",        "code": "OS"},
    {"name": "Oyo",        "slug": "oyo",         "code": "OY"},
    {"name": "Plateau",    "slug": "plateau",     "code": "PL"},
    {"name": "Rivers",     "slug": "rivers",      "code": "RI"},
    {"name": "Sokoto",     "slug": "sokoto",      "code": "SO"},
    {"name": "Taraba",     "slug": "taraba",      "code": "TA"},
    {"name": "Yobe",       "slug": "yobe",        "code": "YO"},
    {"name": "Zamfara",    "slug": "zamfara",     "code": "ZA"},
    {"name": "Federal Capital Territory", "slug": "federal-capital-territory", "code": "FC"},
]


def cf_headers():
    """Build Cloudflare auth headers."""
    return {
        'Authorization': f'Bearer {CF_API_TOKEN}',
        'Content-Type': 'application/json',
    }


# ──────────────────────────────────────────────
# Strategy 1: Cloudflare Browser Rendering /crawl
# ──────────────────────────────────────────────

def start_crawl(start_url, max_pages=50, max_depth=2):
    """Start an async crawl job via Cloudflare Browser Rendering."""
    payload = {
        "url": start_url,
        "render": True,
        "maxDepth": max_depth,
        "maxPages": max_pages,
        "output": "markdown",
    }
    resp = requests.post(
        f'{CF_BASE_URL}/crawl',
        headers=cf_headers(),
        json=payload,
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()
    job_id = data.get('result', {}).get('jobId') or data.get('result', {}).get('job_id')
    print(f"  ✓ Crawl job started: {job_id}")
    return job_id


def poll_crawl(job_id, max_wait=600, interval=15):
    """Poll a crawl job until it completes or times out."""
    elapsed = 0
    while elapsed < max_wait:
        resp = requests.get(
            f'{CF_BASE_URL}/crawl/{job_id}',
            headers=cf_headers(),
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        status = data.get('result', {}).get('status', 'unknown')
        print(f"  ⏳ Job {job_id}: {status} ({elapsed}s)")

        if status in ('complete', 'completed', 'done'):
            return data.get('result', {})
        if status in ('failed', 'error'):
            print(f"  ✗ Crawl failed: {data}")
            return None

        time.sleep(interval)
        elapsed += interval

    print("  ✗ Timeout waiting for crawl to complete")
    return None


# ──────────────────────────────────────────────
# Strategy 2: Cloudflare Browser Rendering /content
#   (Single-page fetch, more reliable for SPAs)
# ──────────────────────────────────────────────

def fetch_rendered_page(url, wait_ms=5000):
    """
    Fetch a single page via Cloudflare Browser Rendering /content endpoint.
    This renders JS and waits for the SPA to hydrate.
    """
    payload = {
        "url": url,
        "renderJs": True,
        "waitFor": wait_ms,  # Wait for SPA to load
    }
    resp = requests.post(
        f'{CF_BASE_URL}/content',
        headers=cf_headers(),
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    data = resp.json()
    html = data.get('result', {}).get('html', '')
    return html


# ──────────────────────────────────────────────
# Fallback: Direct fetch (for SSR pages like /states)
# ──────────────────────────────────────────────

def fetch_direct(url):
    """Simple HTTP GET for server-rendered pages."""
    try:
        resp = requests.get(url, timeout=30, headers={
            'User-Agent': 'GreenFutureConnect/1.0 (civic-data-aggregator)'
        })
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"  ✗ Direct fetch failed for {url}: {e}")
        return None


# ──────────────────────────────────────────────
# Main Scraper Logic
# ──────────────────────────────────────────────

def scrape_all_lgas():
    """
    Main entry point: iterate all 37 states, scrape each LGA detail page,
    extract chairman name + allocation, upsert into Supabase.
    """
    print("=" * 60)
    print("  OurLgaMoni → Green Future Connect  Data Scraper")
    print("=" * 60)

    if not CF_ACCOUNT_ID or not CF_API_TOKEN:
        print("\n⚠️  Cloudflare credentials not set. Falling back to direct fetch mode.")
        print("   Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in .env")
        use_cf = False
    else:
        use_cf = True

    total_scraped = 0
    total_errors = 0
    results = []

    for state_info in NIGERIAN_STATES:
        state_name = state_info['name']
        state_slug = state_info['slug']
        state_code = state_info['code']

        print(f"\n{'─'*50}")
        print(f"  📍 Processing: {state_name} ({state_code})")
        print(f"{'─'*50}")

        # Ensure state exists in DB
        try:
            state_record = upsert_state(state_name, state_code)
            state_id = state_record['id']
        except Exception as e:
            print(f"  ✗ Failed to upsert state {state_name}: {e}")
            total_errors += 1
            continue

        # Fetch the state page to get the LGA list
        state_url = f'https://ourlgamoni.com/state/{state_slug}'
        print(f"  Fetching state page: {state_url}")

        if use_cf:
            try:
                html = fetch_rendered_page(state_url, wait_ms=6000)
            except Exception as e:
                print(f"  ✗ CF fetch failed, trying direct: {e}")
                html = fetch_direct(state_url)
        else:
            html = fetch_direct(state_url)

        if not html:
            print(f"  ✗ Could not fetch state page for {state_name}")
            total_errors += 1
            continue

        # Parse LGA list from state page
        lga_slugs = parse_state_lga_list(html, state_slug)
        print(f"  Found {len(lga_slugs)} LGAs in {state_name}")

        if not lga_slugs:
            print(f"  ⚠️  No LGAs parsed from state page. Skipping.")
            continue

        # Fetch each LGA detail page
        for lga_info in lga_slugs:
            lga_slug = lga_info['slug']
            lga_name = lga_info['name']
            lga_url = f'https://ourlgamoni.com/lga/{state_slug}/{lga_slug}'

            print(f"\n    🔹 {lga_name} ({lga_url})")

            try:
                if use_cf:
                    lga_html = fetch_rendered_page(lga_url, wait_ms=6000)
                else:
                    lga_html = fetch_direct(lga_url)

                if not lga_html:
                    print(f"    ✗ Failed to fetch LGA page")
                    total_errors += 1
                    continue

                # Parse chairman + allocation
                lga_data = parse_lga_detail(lga_html)

                if not lga_data:
                    print(f"    ✗ Failed to parse LGA data")
                    total_errors += 1
                    continue

                chairman_name = lga_data.get('chairman', '')
                allocation_amount = lga_data.get('allocation_amount', 0)
                allocation_period = lga_data.get('allocation_period', '')

                print(f"    ✓ Chairman: {chairman_name}")
                print(f"    ✓ Allocation: ₦{allocation_amount:,.0f} ({allocation_period})")

                # Upsert LGA with chairman into Supabase
                lga_record = find_lga_by_name(state_id, lga_name)
                if not lga_record:
                    lga_record = upsert_lga(state_id, lga_name)

                if lga_record:
                    lga_id = lga_record['id']

                    # Update chairman name on the LGA record
                    from writer import supabase
                    supabase.table('lgas').update({
                        'chairman': chairman_name,
                        'last_data_update': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    }).eq('id', lga_id).execute()

                    # Insert allocation record
                    if allocation_amount > 0 and allocation_period:
                        # We use a combined source_id approach
                        insert_allocation(
                            lga_id=lga_id,
                            source_id=get_or_create_ourlgamoni_source(),
                            period=allocation_period,
                            amount=allocation_amount,
                            raw=json.dumps(lga_data),
                        )

                    total_scraped += 1
                    results.append({
                        'state': state_name,
                        'lga': lga_name,
                        'chairman': chairman_name,
                        'allocation': allocation_amount,
                        'period': allocation_period,
                    })
                else:
                    print(f"    ✗ Could not find/create LGA record")
                    total_errors += 1

            except Exception as e:
                print(f"    ✗ Error processing {lga_name}: {e}")
                total_errors += 1
                continue

            # Rate limiting: be respectful
            time.sleep(1.5)

    # ──────────────────────────────────────────────
    # Summary
    # ──────────────────────────────────────────────
    print(f"\n{'='*60}")
    print(f"  SCRAPE COMPLETE")
    print(f"  ✓ Successfully scraped: {total_scraped} LGAs")
    print(f"  ✗ Errors: {total_errors}")
    print(f"{'='*60}")

    # Save results to JSON file for reference
    output_path = os.path.join(os.path.dirname(__file__), 'ourlgamoni_results.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"  📁 Results saved to: {output_path}")

    return results


_ourlgamoni_source_id = None

def get_or_create_ourlgamoni_source():
    """Get or create the OurLgaMoni source record."""
    global _ourlgamoni_source_id
    if _ourlgamoni_source_id:
        return _ourlgamoni_source_id

    from writer import get_source_id_by_url, register_source
    url = 'https://ourlgamoni.com'
    source_id = get_source_id_by_url(url)
    if not source_id:
        source_id = register_source(url, {
            'name': 'OurLgaMoni FAAC Tracker',
            'url': url,
            'type': 'civic_aggregator',
            'parser': 'ourlgamoni_v1',
        })
    _ourlgamoni_source_id = source_id
    return source_id


if __name__ == '__main__':
    scrape_all_lgas()
