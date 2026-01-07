-- Temporary policy to allow data population
-- This allows inserting LGA data (admin operation)

-- Add INSERT policy for LGAs (for data population)
CREATE POLICY "Allow data population for LGAs" ON public.lgas
    FOR INSERT 
    WITH CHECK (true);

-- Add INSERT policy for projects
CREATE POLICY IF NOT EXISTS "Allow data population for projects" ON public.lga_projects
    FOR INSERT 
    WITH CHECK (true);

-- Add INSERT policy for budget allocations
CREATE POLICY IF NOT EXISTS "Allow data population for budget" ON public.budget_allocations
    FOR INSERT 
    WITH CHECK (true);

-- Add INSERT policy for politicians
CREATE POLICY IF NOT EXISTS "Allow data population for politicians" ON public.politicians
    FOR INSERT 
    WITH CHECK (true);
