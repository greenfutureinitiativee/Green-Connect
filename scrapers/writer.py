# writer.py
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPA_URL = os.environ.get('SUPABASE_URL')
SUPA_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') # Use service role key for writing

if not SUPA_URL or not SUPA_KEY:
    # Fallback for dev environment if env vars are named differently
    SUPA_URL = os.environ.get('VITE_SUPABASE_URL')
    SUPA_KEY = os.environ.get('VITE_SUPABASE_ANON_KEY') 

# Ideally we need service_role key to bypass RLS for writing if RLS is strict
# For now, we assume the key provided has permissions.

supabase: Client = create_client(SUPA_URL, SUPA_KEY)

def get_source_id_by_url(url):
    r = supabase.table('sources').select('id').eq('url', url).limit(1).execute()
    # supabase-py v2 returns an object with .data
    data = r.data
    return data[0]['id'] if data else None

def register_source(url, source_def):
    """
    Registers a new source if it doesn't exist.
    """
    payload = {
        'name': source_def.get('name', 'Unknown Source'),
        'url': url,
        'type': source_def.get('type', 'state_portal'),
        'parser': source_def.get('parser'),
        'active': True
    }
    r = supabase.table('sources').upsert(payload, on_conflict='url').execute()
    return r.data[0]['id'] if r.data else None

def upsert_state(name, code):
    r = supabase.table('states').upsert({'name':name,'code':code}, on_conflict='code').execute()
    return r.data[0]

def find_lga_by_name(state_id, lga_name):
    """
    Tries to find an LGA by name and state_id.
    """
    # First try exact match on name and state_id
    r = supabase.table('lgas').select('*').eq('state_id', state_id).ilike('name', lga_name).execute()
    if r.data:
        return r.data[0]
    
    # If not found, try to find by name only (risk of collision if same name in diff states, but unlikely for unique names)
    # Better: Get state name from state_id and query by state name (text) if state_id is null in lgas
    # But we added state_id to lgas, so we should rely on it.
    # If state_id is not populated in lgas yet, we might fail.
    
    return None

def upsert_lga(state_id, name, code=None, metadata=None):
    """
    Upserts an LGA. 
    NOTE: Existing lgas table uses UUID and (name, state) unique constraint.
    We need to handle this carefully.
    """
    # Check if LGA exists by name and state_id
    existing = find_lga_by_name(state_id, name)
    if existing:
        # Update if needed
        if metadata:
            supabase.table('lgas').update({'metadata': metadata}).eq('id', existing['id']).execute()
        return existing

    # If not exists, we need to create it.
    # We need 'state' text column because it's required in existing schema (probably).
    # Fetch state name
    state_r = supabase.table('states').select('name').eq('id', state_id).single().execute()
    state_name = state_r.data['name'] if state_r.data else 'Unknown'

    payload = {
        'state_id': state_id, 
        'name': name, 
        'state': state_name, # Required by existing schema
        'code': code or name
    }
    if metadata: payload['metadata'] = metadata
    
    # We rely on the database to generate UUID for id
    r = supabase.table('lgas').upsert(payload, on_conflict='name, state').execute()
    return r.data[0] if r.data else None

def insert_allocation(lga_id, source_id, period, amount, raw):
    payload = {
      'lga_id': lga_id,
      'source_id': source_id,
      'period': period,
      'amount': amount,
      'raw': raw
    }
    # on_conflict is (lga_id, source_id, period)
    r = supabase.table('lga_allocations').upsert(payload, on_conflict='lga_id,source_id,period').execute()
    return r.data
