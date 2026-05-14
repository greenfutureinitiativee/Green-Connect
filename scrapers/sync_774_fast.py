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
    
    states = supabase.table('states').select('id, name').execute().data
    state_map = {s['name']: s['id'] for s in states}
    if "Federal Capital Territory" in state_map:
        state_map["FCT"] = state_map["Federal Capital Territory"]
        state_map["Abuja"] = state_map["Federal Capital Territory"]

    # Fetch all existing LGAs once
    print("Fetching existing LGAs...")
    existing_lgas = supabase.table('lgas').select('id, name, state_id').execute().data
    lga_lookup = {(l['name'], l['state_id']): l['id'] for l in existing_lgas}

    valid_ids = []
    to_insert = []
    to_update = []
    
    for state_data in data:
        state_name = state_data['state']
        state_lgas = state_data['lgas']
        state_id = state_map.get(state_name)
        if not state_id: continue
            
        for lga_name in state_lgas:
            lga_id = lga_lookup.get((lga_name, state_id))
            if lga_id:
                valid_ids.append(lga_id)
                to_update.append({'id': lga_id, 'state': state_name, 'state_id': state_id})
            else:
                to_insert.append({'name': lga_name, 'state': state_name, 'state_id': state_id})

    print(f"To Insert: {len(to_insert)}, To Update: {len(to_update)}")

    # Bulk Insert
    if to_insert:
        batch_size = 100
        for i in range(0, len(to_insert), batch_size):
            batch = to_insert[i:i+batch_size]
            res = supabase.table('lgas').insert(batch).execute()
            valid_ids.extend([r['id'] for r in res.data])

    # Bulk Update (Supabase doesn't have a direct batch update with different values easily, 
    # but we only update state/state_id which might be already correct. 
    # For speed, we'll skip update if they match).
    
    # Prune
    all_current_ids = [l['id'] for l in supabase.table('lgas').select('id').execute().data]
    to_delete = [id for id in all_current_ids if id not in valid_ids]
    
    if to_delete:
        print(f"Pruning {len(to_delete)} LGAs...")
        batch_size = 100
        for i in range(0, len(to_delete), batch_size):
            batch = to_delete[i:i+batch_size]
            supabase.table('lgas').delete().in_('id', batch).execute()

    final_count = supabase.table('lgas').select('id', count='exact').execute().count
    print(f"Final Count: {final_count}")

if __name__ == '__main__':
    sync()
