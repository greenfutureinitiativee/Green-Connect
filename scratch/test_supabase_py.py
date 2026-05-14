import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
url = os.environ.get('SUPABASE_URL')
key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

print(f"Connecting to {url}")
supabase = create_client(url, key)
print("Connected. Fetching count...")
res = supabase.table('lgas').select('id', count='exact').execute()
print(f"Count: {res.count}")
