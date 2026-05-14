"""
Quick Playwright-based scraper for OurLgaMoni.com
Extracts LGA names, chairman names, and FAAC allocations
by rendering the SPA pages in a headless browser.

Usage:
    python scrapers/ourlgamoni_playwright.py
"""

import os
import sys
import json
import time
import re

# Fix Windows console encoding
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

from writer import upsert_lga, insert_allocation, find_lga_by_name, upsert_state, supabase
from workers.html_parsers.ourlgamoni_parser import parse_naira_amount

from playwright.sync_api import sync_playwright

# All 37 Nigerian state slugs
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


_ourlgamoni_source_id = None

def get_or_create_source():
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
            'parser': 'ourlgamoni_playwright_v1',
        })
    _ourlgamoni_source_id = source_id
    return source_id


def scrape_state_lgas(page, state_info):
    """
    Navigate to a state page, wait for the LGA leaderboard to load,
    and extract all LGA rows (name + allocation amount).
    """
    state_name = state_info['name']
    state_slug = state_info['slug']
    url = f'https://ourlgamoni.com/state/{state_slug}'

    print(f"\n  >> {state_name}", flush=True)
    print(f"     {url}", flush=True)

    try:
        page.goto(url, timeout=60000, wait_until='networkidle')
        # Wait for the leaderboard table to appear
        page.wait_for_selector('table', timeout=15000)
        time.sleep(2)  # Extra settle time for SPA
    except Exception as e:
        print(f"     [FAIL] Page load failed: {e}", flush=True)
        return []

    # Robust extraction: Look for all LGA links and search their parent row for data
    try:
        rows = page.evaluate(r'''(stateSlug) => {
            const results = [];
            // Find all links that look like LGA detail links
            const lgaLinks = Array.from(document.querySelectorAll(`a[href*="/lga/${stateSlug}/"]`));
            
            lgaLinks.forEach(link => {
                const lgaName = link.textContent.trim();
                if (!lgaName) return;

                // Find the "row" container (try multiple levels)
                let row = link.closest('tr') || link.closest('.table-row-container') || link.parentElement.closest('div');
                
                // If it's just a div, we might need to go up a few levels to find the one containing the allocation
                // Let's look for a container that has both the link and a Naira symbol
                let depth = 0;
                while (row && !row.innerText.includes('₦') && depth < 3) {
                    row = row.parentElement;
                    depth++;
                }

                if (row) {
                    const rowText = row.innerText;
                    // Find Naira amount (e.g. ₦698.64M or ₦1.2B)
                    const allocMatch = rowText.match(/₦\s*([\d,]+\.?\d*[BMK]?)/i);
                    const allocation = allocMatch ? allocMatch[0] : '';

                    // Deduplicate
                    if (!results.some(r => r.name === lgaName)) {
                        results.push({
                            name: lgaName,
                            state: '', // Not strictly needed here
                            allocation_raw: allocation,
                        });
                    }
                }
            });
            return results;
        }''', state_slug)
    except Exception as e:
        print(f"     [FAIL] JS eval failed: {e}", flush=True)
        return []

    print(f"     Found {len(rows)} LGAs in leaderboard", flush=True)
    return rows


def scrape_lga_details(page, state_slug, lga_name):
    """
    Navigate to an LGA detail page and extract chairman name and latest allocation period.
    """
    # Build slug from name
    lga_slug = lga_name.lower().replace(' ', '-').replace("'", "")
    url = f'https://ourlgamoni.com/lga/{state_slug}/{lga_slug}'

    result = {'chairman': '', 'period': ''}

    retries = 2
    for attempt in range(retries):
        try:
            page.goto(url, timeout=60000, wait_until='networkidle')
            time.sleep(3)
            
            data = page.evaluate(r'''() => {
                return {
                    headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, .text-3xl, .text-2xl, .font-bold')).map(el => el.textContent.trim()),
                    all_text: Array.from(document.querySelectorAll('span, p, div, .badge, .pill')).map(el => el.textContent.trim())
                };
            }''')

            headings = data.get('headings', [])
            all_text = data.get('all_text', [])
            
            # 1. Extract Chairman in Python
            exclusion = re.compile(r'Comparison|Leaderboard|Deep Dive|FAAC|Allocation|State|LGA|Nigeria|Track|Update|Login|Menu|Filter|Search|Suggest|Data|Transparency|Portal|Top 10|visible on the ground|Local Government Areas in|₦|Join the Watch|Auditor Army|Initiative|Monthly|Platform|Disclaimer|Source|Directory|Guardian|Notification|Alerted|Notify|The Watch|OurLgaMoni|%|vs', re.I)
            period_pattern = re.compile(r'^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+20\d{2}$', re.I)
            
            chairman = ''
            for h in headings:
                if 3 < len(h) < 50 and 2 <= len(h.split()) <= 4:
                    if lga_name.lower() not in h.lower() and not exclusion.search(h) and not period_pattern.match(h):
                        chairman = h
                        break
            
            # 2. Extract Period in Python
            period = ''
            for text in all_text:
                if re.match(r'^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+20\d{2}$', text, re.I):
                    period = text
                    break
                    
            return {'chairman': chairman, 'period': period}
        except Exception as e:
            if attempt == retries - 1:
                print(f"     [WARN] Failed to scrape details for {lga_name} after {retries} attempts: {e}")
            else:
                time.sleep(5)
                continue
                
    return result


def main():
    print("=" * 60, flush=True)
    print("  OurLgaMoni Playwright Scraper", flush=True)
    print("  Extracting LGA allocations + chairman names", flush=True)
    print("=" * 60, flush=True)

    total_scraped = 0
    total_errors = 0
    all_results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()

        for state_info in NIGERIAN_STATES:
            state_name = state_info['name']
            state_code = state_info['code']
            state_slug = state_info['slug']

            # Ensure state exists in DB
            try:
                state_record = upsert_state(state_name, state_code)
                state_id = state_record['id']
            except Exception as e:
                print(f"  [FAIL] State upsert failed for {state_name}: {e}", flush=True)
                total_errors += 1
                continue

            # Scrape leaderboard from state page
            lga_rows = scrape_state_lgas(page, state_info)

            for row in lga_rows:
                lga_name = row['name']
                alloc_raw = row.get('allocation_raw', '')
                alloc_amount = parse_naira_amount(alloc_raw)

                # Upsert into Supabase immediately for allocation
                try:
                    lga_record = find_lga_by_name(state_id, lga_name)
                    if not lga_record:
                        lga_record = upsert_lga(state_id, lga_name)

                    if lga_record:
                        lga_id = lga_record['id']
                        
                        # Update allocation on the LGA record
                        if alloc_amount > 0:
                            supabase.table('lgas').update({
                                'annual_budget': int(alloc_amount),
                                'last_data_update': time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                            }).eq('id', lga_id).execute()

                            # Insert into lga_allocations table
                            source_id = get_or_create_source()
                            insert_allocation(
                                lga_id=lga_id,
                                source_id=source_id,
                                period="2026-03-01",
                                amount=int(alloc_amount),
                                raw=json.dumps(row),
                            )

                        # SKIP chairman fetch for now to get prices ASAP
                        # if not lga_record.get('chairman'):
                        #     print(f"     - {lga_name}: Fetching chairman...", flush=True)
                        #     details = scrape_lga_details(page, state_slug, lga_name)
                        #     chairman = details.get('chairman', '')
                        #     if chairman:
                        #         supabase.table('lgas').update({'chairman': chairman}).eq('id', lga_id).execute()
                        #         print(f"       ✓ Chairman: {chairman}", flush=True)
                        # else:
                        #     print(f"     - {lga_name}: {alloc_raw} (Chairman already exists)", flush=True)
                        print(f"     - {lga_name}: {alloc_raw}", flush=True)

                        total_scraped += 1
                    else:
                        print(f"       [FAIL] Could not find/create LGA: {lga_name}", flush=True)
                        total_errors += 1

                except Exception as e:
                    print(f"       [FAIL] Error processing {lga_name}: {e}", flush=True)
                    total_errors += 1

            # Brief pause between states
            time.sleep(1)

        browser.close()

    # Summary
    print(f"\n{'='*60}", flush=True)
    print(f"  SCRAPE COMPLETE", flush=True)
    print(f"  OK: {total_scraped} LGAs scraped", flush=True)
    print(f"  ERRORS: {total_errors}", flush=True)
    print(f"{'='*60}", flush=True)

    # Save results
    output_path = os.path.join(os.path.dirname(__file__), 'ourlgamoni_results.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"  Results saved to: {output_path}", flush=True)


if __name__ == '__main__':
    main()
