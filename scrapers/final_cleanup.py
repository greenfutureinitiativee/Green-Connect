import os
import sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))

# Official 774 LGA list normalization mapping (partial for common duplicates)
MAPPING = {
    "ibiono-ibom": "ibiono ibom",
    "nsit-atai": "nsit atai",
    "nsit-ibom": "nsit ibom",
    "nsit-ubium": "nsit ubium",
    "udung-uko": "udung uko",
    "urue-offong/oruko": "urue offong oruko",
    "urue offong/oruko": "urue offong oruko",
    "mkpat-enin": "mkpat enin",
    "katsina-ala": "katsina ala",
    "oturkpo": "otukpo",
    "yakuur": "yakurr",
    "fufure": "fufore",
    "gayuk": "guyuk",
}

def normalize(name):
    n = name.lower().strip()
    if n.endswith(' lga'): n = n[:-4].strip()
    n = n.replace('-', ' ')
    n = n.replace('/', ' ')
    # Apply specific mapping
    if n in MAPPING:
        n = MAPPING[n]
    return " ".join(n.split()) # normalize whitespace

def run_final_cleanup():
    states = supabase.table('states').select('id, name').execute().data
    state_map = {s['name']: s['id'] for s in states}
    # Add FCT fallback
    if "Federal Capital Territory" in state_map:
        state_map["FCT"] = state_map["Federal Capital Territory"]

    print("Fetching all LGAs...")
    lgas = supabase.table('lgas').select('*').execute().data
    print(f"Total LGAs: {len(lgas)}")

    # 1. Backfill state_id if null
    for lga in lgas:
        if not lga.get('state_id'):
            st_name = lga.get('state')
            if st_name and st_name in state_map:
                lga['state_id'] = state_map[st_name]
                supabase.table('lgas').update({'state_id': lga['state_id']}).eq('id', lga['id']).execute()

    # 2. Identify Duplicates by (normalized_name, state_id)
    seen = {}
    to_delete = []

    for lga in lgas:
        st_id = lga.get('state_id')
        if not st_id: continue # Should be backfilled now
        
        norm_name = normalize(lga['name'])
        key = (norm_name, st_id)

        if key in seen:
            existing = seen[key]
            # Merge logic: if one has more data, keep it.
            has_data_new = lga.get('chairman') or lga.get('annual_budget')
            has_data_old = existing.get('chairman') or existing.get('annual_budget')

            if has_data_new and not has_data_old:
                to_delete.append(existing['id'])
                seen[key] = lga
            else:
                to_delete.append(lga['id'])
        else:
            seen[key] = lga

    print(f"Deleting {len(to_delete)} duplicates...")
    batch_size = 50
    for i in range(0, len(to_delete), batch_size):
        batch = to_delete[i:i+batch_size]
        supabase.table('lgas').delete().in_('id', batch).execute()

    print("Cleanup finished.")

if __name__ == '__main__':
    run_final_cleanup()
