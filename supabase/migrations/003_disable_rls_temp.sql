-- Temporarily disable RLS on lgas table for initial data population
ALTER TABLE public.lgas DISABLE ROW LEVEL SECURITY;

-- After running the population script, you can re-enable it with:
-- ALTER TABLE public.lgas ENABLE ROW LEVEL SECURITY;
