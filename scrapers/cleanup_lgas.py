import os
import sys
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))

def cleanup():
    print("Fetching LGAs...")
    res = supabase.table('lgas').select('id, name, state_id, chairman, annual_budget').execute()
    lgas = res.data
    print(f"Total LGAs before cleanup: {len(lgas)}")

    seen = {} # (name_lower, state_id) -> lga_obj
    to_delete = []

    for lga in lgas:
        name = lga['name'].strip()
        # Normalize name: remove trailing " LGA" (case insensitive)
        if name.lower().endswith(' lga'):
            name = name[:-4].strip()
        
        name_lower = name.lower()
        state_id = lga['state_id']
        key = (name_lower, state_id)

        if key in seen:
            existing = seen[key]
            # Decision logic: which one to keep?
            # Keep the one with more data (chairman or budget)
            has_data_new = lga.get('chairman') or lga.get('annual_budget')
            has_data_old = existing.get('chairman') or existing.get('annual_budget')

            if has_data_new and not has_data_old:
                to_delete.append(existing['id'])
                seen[key] = lga
            else:
                to_delete.append(lga['id'])
        else:
            seen[key] = lga

    print(f"Identified {len(to_delete)} duplicates to delete.")
    
    # Delete in batches to avoid URL length issues or timeouts
    batch_size = 50
    for i in range(0, len(to_delete), batch_size):
        batch = to_delete[i:i+batch_size]
        print(f"Deleting batch {i//batch_size + 1} ({len(batch)} items)...")
        supabase.table('lgas').delete().in_('id', batch).execute()

    # Final count
    res_final = supabase.table('lgas').select('id', count='exact').execute()
    print(f"Total LGAs after cleanup: {res_final.count}")

if __name__ == '__main__':
    cleanup()
