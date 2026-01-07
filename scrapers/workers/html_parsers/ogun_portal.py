# ogun_portal.py
from bs4 import BeautifulSoup
from dateutil import parser as dateparser
import re

def parse_allocations(html):
    """
    Parses allocations from the Ogun state portal HTML.
    This is a placeholder implementation that assumes a specific table structure.
    """
    if not html:
        return []
        
    soup = BeautifulSoup(html, 'html.parser')
    # example: find table rows and extract columns - adjust to actual portal
    # This selector is hypothetical and needs to be adjusted to the real site
    rows = soup.select('table.allocations tr') 
    results = []
    
    # If no rows found with that selector, try a generic table
    if not rows:
        rows = soup.select('table tr')

    for r in rows[1:]: # Skip header
        cols = [c.get_text(strip=True) for c in r.find_all('td')]
        if len(cols) < 3: continue
        
        try:
            # Attempt to parse date, amount, and LGA name
            # This logic is fragile and depends heavily on the specific page layout
            period_str = cols[0]
            amount_str = cols[1]
            lga_name = cols[2]
            
            period = dateparser.parse(period_str).date()
            amount = float(re.sub(r'[^\d.]','', amount_str))
            
            results.append({
                'lga_name': lga_name,
                'period': str(period),
                'amount': amount,
                'raw_row': cols
            })
        except Exception as e:
            # print(f"Skipping row due to parse error: {e}")
            continue
            
    return results
