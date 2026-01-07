# test_scraper.py
import sys
import os
from unittest.mock import MagicMock, patch

# Add current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from workers.html_parsers.ogun_portal import parse_allocations
from writer import upsert_lga, insert_allocation, get_source_id_by_url, register_source, find_lga_by_name, upsert_state

# Mock HTML content
MOCK_HTML = """
<html>
<body>
    <table class="allocations">
        <tr>
            <th>Period</th>
            <th>Amount</th>
            <th>LGA</th>
        </tr>
        <tr>
            <td>January 2024</td>
            <td>₦150,000,000.00</td>
            <td>Abeokuta South</td>
        </tr>
        <tr>
            <td>February 2024</td>
            <td>₦145,500,000.00</td>
            <td>Abeokuta North</td>
        </tr>
    </table>
</body>
</html>
"""

def run_test():
    print("Running test scraper with mock data...")
    
    # 1. Setup Source
    source = {
        'name': 'Test Ogun Source',
        'url': 'https://test.ogunstate.gov.ng/allocations',
        'type': 'state_portal',
        'parser': 'ogun_allocations_v1',
        'state_code': 'OG',
        'state_name': 'Ogun'
    }
    
    # 2. Upsert State
    print("Upserting state...")
    state = upsert_state(source['state_name'], source['state_code'])
    print(f"State ID: {state['id']}")
    
    # 3. Parse Mock HTML
    print("Parsing mock HTML...")
    items = parse_allocations(MOCK_HTML)
    print(f"Parsed {len(items)} items.")
    
    # 4. Register Source
    print("Registering source...")
    source_id = get_source_id_by_url(source['url'])
    if not source_id:
        source_id = register_source(source['url'], source)
    print(f"Source ID: {source_id}")
    
    # 5. Insert Data
    for it in items:
        lga_name = it['lga_name']
        print(f"Processing {lga_name}...")
        
        lga = find_lga_by_name(state['id'], lga_name)
        if not lga:
            print(f"Creating LGA {lga_name}...")
            lga = upsert_lga(state['id'], lga_name)
            
        print(f"LGA ID: {lga['id']}")
        
        result = insert_allocation(lga['id'], source_id, it['period'], it['amount'], it['raw_row'])
        print(f"Inserted allocation: {result}")

if __name__ == "__main__":
    run_test()
