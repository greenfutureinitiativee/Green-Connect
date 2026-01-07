# orchestrator.py
import sys
import os

# Add current directory to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from workers.fetcher import fetch_page
from workers.html_parsers.ogun_portal import parse_allocations
from writer import upsert_lga, insert_allocation, get_source_id_by_url, register_source, find_lga_by_name, upsert_state
from datetime import datetime

# Example configuration of sources
SOURCES = [
    {
        'name': 'Ogun State Allocations',
        'url': 'https://ogunstate.gov.ng/allocations', # Example URL
        'type': 'state_portal',
        'parser': 'ogun_allocations_v1',
        'state_code': 'OG',
        'state_name': 'Ogun'
    }
]

def run_source(source):
    url = source['url']
    parser = source['parser']
    print(f"Processing source: {source['name']} ({url})")
    
    # Ensure state exists
    state = upsert_state(source['state_name'], source['state_code'])
    state_id = state['id']

    # Fetch content
    # For testing, we might want to mock this or handle 404s gracefully
    html = fetch_page(url)
    
    if not html:
        print("Failed to fetch page.")
        return

    # Parse
    items = []
    if parser == 'ogun_allocations_v1':
        items = parse_allocations(html)
    
    if not items:
        print("No items parsed.")
        return

    # Register source if needed
    source_id = get_source_id_by_url(url)
    if not source_id:
        source_id = register_source(url, source)

    print(f"Found {len(items)} items. Inserting...")

    for it in items:
        lga_name = it['lga_name']
        
        # Find or create LGA
        lga = find_lga_by_name(state_id, lga_name)
        if not lga:
            print(f"LGA {lga_name} not found, creating...")
            lga = upsert_lga(state_id, lga_name)
        
        if lga:
            insert_allocation(lga['id'], source_id, it['period'], it['amount'], it['raw_row'])
            print(f"Inserted allocation for {lga_name}")
        else:
            print(f"Could not resolve LGA {lga_name}")

if __name__ == "__main__":
    print("Starting orchestrator...")
    for source in SOURCES:
        run_source(source)
    print("Done.")
