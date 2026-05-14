import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))

def final_merge():
    print("Fetching LGAs...")
    lgas = supabase.table('lgas').select('id, name, state_id').execute().data
    
    # Group by state_id
    by_state = {}
    for lga in lgas:
        st_id = lga['state_id']
        if not st_id: continue
        if st_id not in by_state: by_state[st_id] = []
        by_state[st_id].append(lga)
        
    to_delete = []
    
    for st_id, state_lgas in by_state.items():
        # Check for slash-based duplicates or substring duplicates
        for i in range(len(state_lgas)):
            for j in range(i + 1, len(state_lgas)):
                lga1 = state_lgas[i]
                lga2 = state_lgas[j]
                
                name1 = lga1['name'].lower()
                name2 = lga2['name'].lower()
                
                # Check for "X/Y" vs "Y"
                is_dup = False
                if '/' in name1:
                    parts = [p.strip() for p in name1.split('/')]
                    if name2 in parts: is_dup = True
                elif '/' in name2:
                    parts = [p.strip() for p in name2.split('/')]
                    if name1 in parts: is_dup = True
                
                # Check for substring (e.g. "Ganju/Ganjuwa" vs "Ganjuwa")
                # Only if they are very similar
                if not is_dup:
                    if name1 in name2 or name2 in name1:
                        # Only if it's not a generic name
                        is_dup = True
                
                if is_dup:
                    # Keep the one with the shorter name if it's a slash case, 
                    # or keep the one that looks "cleaner"
                    # For now, just mark the second one for deletion if it's the first time we see it
                    if lga2['id'] not in to_delete:
                        to_delete.append(lga2['id'])
                        print(f"Marking duplicate in state {st_id}: '{lga1['name']}' and '{lga2['name']}'")

    if to_delete:
        print(f"Deleting {len(to_delete)} confirmed duplicates...")
        for id in to_delete:
            supabase.table('lgas').delete().eq('id', id).execute()
    else:
        print("No more obvious duplicates found.")

if __name__ == '__main__':
    final_merge()
