"""
HTML Parser for OurLgaMoni.com pages.

Parses two types of pages:
1. State page → extracts list of LGA slugs
2. LGA detail page → extracts chairman name, allocation amount, period
"""

import re
from html.parser import HTMLParser


# ──────────────────────────────────────────────
# State Page Parser: Extract LGA names + slugs
# ──────────────────────────────────────────────

class StateLGAListParser(HTMLParser):
    """
    Extracts LGA names and URL slugs from the state page leaderboard table.
    OurLgaMoni uses: <a href="/lga/{state_slug}/{lga_slug}">LGA Name</a>
    """

    def __init__(self, state_slug):
        super().__init__()
        self.state_slug = state_slug
        self.lgas = []
        self._in_lga_link = False
        self._current_lga = None

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            href = dict(attrs).get('href', '')
            # Match pattern: /lga/{state_slug}/{lga_slug}
            prefix = f'/lga/{self.state_slug}/'
            if href.startswith(prefix):
                slug = href[len(prefix):].rstrip('/')
                self._in_lga_link = True
                self._current_lga = {'slug': slug, 'name': '', 'href': href}

    def handle_data(self, data):
        if self._in_lga_link and self._current_lga is not None:
            self._current_lga['name'] += data.strip()

    def handle_endtag(self, tag):
        if tag == 'a' and self._in_lga_link:
            self._in_lga_link = False
            if self._current_lga and self._current_lga['name']:
                # Deduplicate by slug
                existing_slugs = {l['slug'] for l in self.lgas}
                if self._current_lga['slug'] not in existing_slugs:
                    self.lgas.append(self._current_lga)
            self._current_lga = None


def parse_state_lga_list(html, state_slug):
    """
    Parse a state page HTML to extract all LGA names and slugs.

    Returns a list of dicts: [{"name": "Alimosho", "slug": "alimosho"}, ...]
    """
    if not html:
        return []

    parser = StateLGAListParser(state_slug)
    try:
        parser.feed(html)
    except Exception as e:
        print(f"  ✗ Parser error (state list): {e}")

    return parser.lgas


# ──────────────────────────────────────────────
# LGA Detail Page Parser: Extract chairman + allocation
# ──────────────────────────────────────────────

def parse_lga_detail(html):
    """
    Parse an LGA detail page to extract:
    - Chairman name
    - Latest allocation amount
    - Allocation period (e.g., "Mar 2026")

    OurLgaMoni renders this client-side, so we need the fully rendered HTML.
    The page typically contains:
    - A section with the chairman's name
    - A section with "LATEST MONTHLY ALLOCATION" and the amount
    """
    if not html:
        return None

    result = {
        'chairman': '',
        'allocation_amount': 0,
        'allocation_period': '',
        'lga_name': '',
    }

    # ── Extract Chairman Name ──
    # Pattern 1: Look for "Chairman" or "Executive Chairman" nearby text
    chairman_patterns = [
        # Common HTML patterns on OurLgaMoni LGA pages
        r'LGA LEADERSHIP\s+([A-Z][a-zA-Z\s\.\-\']+)\s+SUGGEST AN UPDATE',
        r'(?:Executive\s+)?Chairman[:\s]*</[^>]+>\s*<[^>]+>([^<]+)',
        r'(?:Executive\s+)?Chairman[:\s]*([A-Z][a-zA-Z\s\.\-\']+)',
        r'chairman["\s]*>[^<]*<[^>]*>([^<]+)',
        # Pattern for styled chairman name sections
        r'text-xl\s+font-bold[^>]*>([A-Z][a-zA-Z\.\s\-\']+(?:Hon\.|Rt\.|Chief|Dr\.|Engr\.|Barr\.|Alhaji|Alh\.)?\s*[A-Z][a-zA-Z\.\s\-\']+)',
        # Broader pattern
        r'(?:LGA|Local\s+Government)\s+(?:Area\s+)?Chairman[:\s]*([^<\n]+)',
    ]

    for pattern in chairman_patterns:
        match = re.search(pattern, html, re.IGNORECASE)
        if match:
            name = match.group(1).strip()
            # Clean up the name
            name = re.sub(r'\s+', ' ', name)
            name = name.strip(' ,.-')
            if len(name) > 3 and len(name) < 80:
                result['chairman'] = name
                break

    # ── Extract Allocation Amount ──
    # Pattern: Look for Naira amounts near "allocation" keywords
    amount_patterns = [
        # ₦X.XXB format
        r'₦\s*([\d,]+\.?\d*)\s*[Bb]',
        # ₦X,XXX,XXX,XXX format  
        r'₦\s*([\d,]+(?:\.\d+)?)',
        # NGN format
        r'NGN\s*([\d,]+(?:\.\d+)?)',
        # "allocation" context with amount
        r'[Aa]llocat(?:ion|ed)[^₦₦]*₦\s*([\d,]+\.?\d*)\s*([BbMmKk])?',
    ]

    for pattern in amount_patterns:
        match = re.search(pattern, html)
        if match:
            raw_amount = match.group(1).replace(',', '')
            try:
                amount = float(raw_amount)
                # Check for B/M/K suffix
                if len(match.groups()) > 1 and match.group(2):
                    suffix = match.group(2).upper()
                    if suffix == 'B':
                        amount *= 1_000_000_000
                    elif suffix == 'M':
                        amount *= 1_000_000
                    elif suffix == 'K':
                        amount *= 1_000
                elif amount < 1000:
                    # If small number, probably in billions
                    amount *= 1_000_000_000
                result['allocation_amount'] = amount
                break
            except ValueError:
                continue

    # ── Extract Period ──
    period_patterns = [
        # "Mar 2026", "March 2026", etc.
        r'(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*[\'"]?\s*(20\d{2})',
        # "2026-03" format
        r'(20\d{2})-(0[1-9]|1[0-2])',
    ]

    for pattern in period_patterns:
        match = re.search(pattern, html, re.IGNORECASE)
        if match:
            if '-' in match.group(0):
                # Convert "2026-03" to "Mar 2026"
                months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                year = match.group(1)
                month_num = int(match.group(2))
                result['allocation_period'] = f"{months[month_num]} {year}"
            else:
                month = match.group(1)[:3]
                year = match.group(2)
                result['allocation_period'] = f"{month} {year}"
            break

    # ── Extract LGA Name from page ──
    name_match = re.search(r'<h[12][^>]*>([^<]+(?:Local\s+Government|LGA)?[^<]*)</h[12]>', html)
    if name_match:
        result['lga_name'] = name_match.group(1).strip()

    return result


# ──────────────────────────────────────────────
# Alternative: Parse the leaderboard table from state page
# This can extract allocation amounts directly without
# needing to visit each LGA page
# ──────────────────────────────────────────────

class LeaderboardParser(HTMLParser):
    """
    Parse the LGA Leaderboard table on a state page.
    Extracts: LGA Name, State, Allocation Amount, MoM change.
    """

    def __init__(self):
        super().__init__()
        self.lgas = []
        self._in_table = False
        self._in_row = False
        self._in_cell = False
        self._current_row = []
        self._cell_text = ''
        self._in_link = False
        self._current_href = ''

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == 'table':
            self._in_table = True
        elif tag == 'tr' and self._in_table:
            self._in_row = True
            self._current_row = []
        elif tag == 'td' and self._in_row:
            self._in_cell = True
            self._cell_text = ''
        elif tag == 'a' and self._in_cell:
            self._in_link = True
            self._current_href = attr_dict.get('href', '')

    def handle_data(self, data):
        if self._in_cell:
            self._cell_text += data.strip()

    def handle_endtag(self, tag):
        if tag == 'td' and self._in_cell:
            self._in_cell = False
            self._current_row.append(self._cell_text)
        elif tag == 'tr' and self._in_row:
            self._in_row = False
            if len(self._current_row) >= 4:
                # Columns: #, LGA, STATE, ALLOCATION, MOM, TREND
                try:
                    lga_name = self._current_row[1].strip()
                    state = self._current_row[2].strip()
                    alloc_str = self._current_row[3].strip()

                    # Parse allocation: "₦2.76B" → 2760000000
                    amount = parse_naira_amount(alloc_str)

                    if lga_name and not lga_name.startswith('#'):
                        self.lgas.append({
                            'name': lga_name,
                            'state': state,
                            'allocation': amount,
                            'allocation_raw': alloc_str,
                        })
                except (IndexError, ValueError):
                    pass
        elif tag == 'table':
            self._in_table = False
        elif tag == 'a':
            self._in_link = False


def parse_naira_amount(text):
    """Parse a Naira amount string like '₦2.76B' or '₦1,234,567,890' into a float."""
    if not text:
        return 0

    # Remove ₦ and whitespace
    clean = text.replace('₦', '').replace('N', '').strip()

    # Check for B/M/K suffix
    multiplier = 1
    if clean.upper().endswith('B'):
        multiplier = 1_000_000_000
        clean = clean[:-1]
    elif clean.upper().endswith('M'):
        multiplier = 1_000_000
        clean = clean[:-1]
    elif clean.upper().endswith('K'):
        multiplier = 1_000
        clean = clean[:-1]

    # Remove commas
    clean = clean.replace(',', '').strip()

    try:
        return float(clean) * multiplier
    except ValueError:
        return 0


def parse_leaderboard(html):
    """Parse the leaderboard table from a state page."""
    if not html:
        return []
    parser = LeaderboardParser()
    try:
        parser.feed(html)
    except Exception as e:
        print(f"  ✗ Leaderboard parser error: {e}")
    return parser.lgas
