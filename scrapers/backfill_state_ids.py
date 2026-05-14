import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))

def backfill():
    states = supabase.table('states').select('id, name').execute().data
    state_map = {s['name']: s['id'] for s in states}
    # Some states might have slightly different names in lgas table
    # Let's check for "Federal Capital Territory" vs "FCT"
    if "Federal Capital Territory" in state_map:
        state_map["FCT"] = state_map["Federal Capital Territory"]
        state_map["Abuja"] = state_map["Federal Capital Territory"]

    lgas = supabase.table('lgas').select('id, state').is_('state_id', 'null').execute().data
    print(f"Found {len(lgas)} LGAs missing state_id.")
    
    for lga in lgas:
        state_name = lga['state']
        if state_name in state_map:
            supabase.table('lgas').update({'state_id': state_map[state_name]}).eq('id', lga['id']).execute()
        else:
            # Try fuzzy match if needed, but let's stick to exact for now
            pass
    
    print("Backfill complete.")

if __name__ == '__main__':
    backfill()
