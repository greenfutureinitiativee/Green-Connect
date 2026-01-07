-- 1. states (New table)
CREATE TABLE IF NOT EXISTS public.states (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  created_at timestamptz default now()
);

-- 2. lgas (Modify existing)
-- Existing columns: id, name, state, population, etc.
-- Add new columns if they don't exist
ALTER TABLE public.lgas ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE public.lgas ADD COLUMN IF NOT EXISTS geo jsonb;
ALTER TABLE public.lgas ADD COLUMN IF NOT EXISTS metadata jsonb;
-- We keep 'state' text column for now, but we could add state_id if we populate states table.
ALTER TABLE public.lgas ADD COLUMN IF NOT EXISTS state_id int REFERENCES public.states(id) ON DELETE SET NULL;

-- 3. sources (New table)
CREATE TABLE IF NOT EXISTS public.sources (
  id serial PRIMARY KEY,
  name text NOT NULL,
  url text NOT NULL,
  type text NOT NULL, -- 'state_portal','treasury','pdf','news','faac'
  parser text NULL, -- parser id to use
  active boolean default true,
  last_checked timestamptz
);

-- 4. lga_allocations (New table)
CREATE TABLE IF NOT EXISTS public.lga_allocations (
  id bigserial PRIMARY KEY,
  lga_id UUID NOT NULL REFERENCES public.lgas(id) ON DELETE CASCADE, -- Changed to UUID
  source_id int REFERENCES public.sources(id),
  period date NOT NULL,
  amount numeric(20,2) NOT NULL,
  currency text default 'NGN',
  details jsonb NULL, -- breakdown if any
  raw jsonb, -- raw scraped payload
  fetched_at timestamptz default now(),
  UNIQUE(lga_id, source_id, period)
);
CREATE INDEX IF NOT EXISTS idx_lga_allocations_lga ON public.lga_allocations(lga_id);
CREATE INDEX IF NOT EXISTS idx_lga_allocations_period ON public.lga_allocations(period);

-- 5. lga_spendings (New table)
CREATE TABLE IF NOT EXISTS public.lga_spendings (
  id bigserial PRIMARY KEY,
  lga_id UUID NOT NULL REFERENCES public.lgas(id), -- Changed to UUID
  source_id int REFERENCES public.sources(id),
  date date NOT NULL,
  amount numeric(20,2) NOT NULL,
  category text NULL,
  description text NULL,
  contract_or_ref text NULL,
  raw jsonb NULL,
  fetched_at timestamptz default now()
);
CREATE INDEX IF NOT EXISTS idx_lga_spendings_lga ON public.lga_spendings(lga_id);
CREATE INDEX IF NOT EXISTS idx_lga_spendings_date ON public.lga_spendings(date);

-- 6. lga_projects (Modify existing)
-- Existing: id, lga_id, name, description, budget_allocated, budget_spent, status, start_date, completion_date, category...
ALTER TABLE public.lga_projects ADD COLUMN IF NOT EXISTS source_id int REFERENCES public.sources(id);
ALTER TABLE public.lga_projects ADD COLUMN IF NOT EXISTS contractor text;
ALTER TABLE public.lga_projects ADD COLUMN IF NOT EXISTS geo jsonb;
ALTER TABLE public.lga_projects ADD COLUMN IF NOT EXISTS raw jsonb;
ALTER TABLE public.lga_projects ADD COLUMN IF NOT EXISTS fetched_at timestamptz default now();

-- 7. update_logs (New table)
CREATE TABLE IF NOT EXISTS public.update_logs (
  id serial PRIMARY KEY,
  source_id int REFERENCES public.sources(id),
  run_at timestamptz default now(),
  status text, -- success, partial, failed
  items_processed int,
  error jsonb NULL
);

-- 8. alerts (New table)
CREATE TABLE IF NOT EXISTS public.alerts (
  id bigserial PRIMARY KEY,
  lga_id UUID REFERENCES public.lgas(id), -- Changed to UUID
  alert_type text NOT NULL, -- e.g. 'allocation_drop','missing_projects','suspicious_contract'
  details jsonb,
  created_at timestamptz default now(),
  resolved boolean default false
);

-- Enable RLS on new tables
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lga_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lga_spendings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.update_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Public read policies for new tables (adjust as needed)
CREATE POLICY "States are viewable by everyone" ON public.states FOR SELECT USING (true);
CREATE POLICY "Sources are viewable by everyone" ON public.sources FOR SELECT USING (true);
CREATE POLICY "LGA allocations are viewable by everyone" ON public.lga_allocations FOR SELECT USING (true);
CREATE POLICY "LGA spendings are viewable by everyone" ON public.lga_spendings FOR SELECT USING (true);
CREATE POLICY "Alerts are viewable by everyone" ON public.alerts FOR SELECT USING (true);
