import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))

LGA_JSON_PATH = 'src/data/lgas.json'

def sync():
    if not os.path.exists(LGA_JSON_PATH):
        print(f"Error: {LGA_JSON_PATH} not found.")
        return

    with open(LGA_JSON_PATH, 'r') as f:
        data = json.load(f)

    print(f"Loaded {len(data)} states from JSON.")
    
    print("Fetching states from DB...")
    states = supabase.table('states').select('id, name').execute().data
    print(f"Fetched {len(states)} states from DB.")
    state_map = {s['name']: s['id'] for s in states}
    # Fallbacks
    if "Federal Capital Territory" in state_map:
        state_map["FCT"] = state_map["Federal Capital Territory"]
        state_map["Abuja"] = state_map["Federal Capital Territory"]

    print("Synchronizing LGAs...")
    
    valid_ids = []
    total_expected = 0
    
    for state_data in data:
        state_name = state_data['state']
        state_lgas = state_data['lgas']
        total_expected += len(state_lgas)
        
        state_id = state_map.get(state_name)
        if not state_id:
            print(f"Warning: State '{state_name}' not found in DB states table.")
            continue
            
        for lga_name in state_lgas:
            # Upsert LGA
            # We use a unique constraint on (name, state_id) or (name, state)
            # Check if exists first to avoid overwriting chairman/budget with null
            res = supabase.table('lgas').select('id, chairman, annual_budget').eq('name', lga_name).eq('state_id', state_id).execute()
            
            if res.data:
                lga_id = res.data[0]['id']
                # Update existing record (ensure state_id and state name are set)
                supabase.table('lgas').update({
                    'state': state_name,
                    'state_id': state_id
                }).eq('id', lga_id).execute()
                valid_ids.append(lga_id)
            else:
                # Create new record
                res_new = supabase.table('lgas').insert({
                    'name': lga_name,
                    'state': state_name,
                    'state_id': state_id
                }).execute()
                if res_new.data:
                    valid_ids.append(res_new.data[0]['id'])

    print(f"Expected: {total_expected}, Found/Created: {len(valid_ids)}")
    
    # Prune! Delete all LGAs whose ID is NOT in valid_ids
    # We do this in batches
    all_lgas = supabase.table('lgas').select('id').execute().data
    all_ids = [l['id'] for l in all_lgas]
    to_delete = [id for id in all_ids if id not in valid_ids]
    
    if to_delete:
        print(f"Pruning {len(to_delete)} LGAs not in master list...")
        batch_size = 50
        for i in range(0, len(to_delete), batch_size):
            batch = to_delete[i:i+batch_size]
            supabase.table('lgas').delete().in_('id', batch).execute()
    
    # Final count
    final_res = supabase.table('lgas').select('id', count='exact').execute()
    print(f"Final LGA count in DB: {final_res.count}")

if __name__ == '__main__':
    sync()
