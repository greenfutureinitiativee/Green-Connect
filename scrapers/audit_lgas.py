import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.environ.get('SUPABASE_URL'), os.environ.get('SUPABASE_SERVICE_ROLE_KEY'))

EXPECTED_COUNTS = {
    "Abia": 17, "Adamawa": 21, "Akwa Ibom": 31, "Anambra": 21, "Bauchi": 20,
    "Bayelsa": 8, "Benue": 23, "Borno": 27, "Cross River": 18, "Delta": 25,
    "Ebonyi": 13, "Edo": 18, "Ekiti": 16, "Enugu": 17, "Gombe": 11,
    "Imo": 27, "Jigawa": 27, "Kaduna": 23, "Kano": 44, "Katsina": 34,
    "Kebbi": 21, "Kogi": 21, "Kwara": 16, "Lagos": 20, "Nasarawa": 13,
    "Niger": 25, "Ogun": 20, "Ondo": 18, "Osun": 30, "Oyo": 33,
    "Plateau": 17, "Rivers": 23, "Sokoto": 23, "Taraba": 16, "Yobe": 17,
    "Zamfara": 14, "Federal Capital Territory": 6
}

def audit():
    states = supabase.table('states').select('id, name').execute().data
    total_found = 0
    
    for s in states:
        name = s['name']
        expected = EXPECTED_COUNTS.get(name, 0)
        res = supabase.table('lgas').select('id, name').eq('state_id', s['id']).execute()
        lgas = res.data
        count = len(lgas)
        total_found += count
        
        if count != expected:
            print(f"Mismatch in {name}: Expected {expected}, Found {count}")
            if count > expected:
                print(f"  LGAs found: {[l['name'] for l in lgas]}")
    
    print(f"\nTotal LGAs in DB: {total_found}")

if __name__ == '__main__':
    audit()
