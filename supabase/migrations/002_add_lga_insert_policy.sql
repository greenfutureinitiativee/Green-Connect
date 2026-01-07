-- Add INSERT policy for lgas table to allow initial data population
-- This allows anyone to insert LGAs (you can restrict this later if needed)

CREATE POLICY "Allow LGA insertion for initial setup" ON public.lgas
    FOR INSERT WITH CHECK (true);

-- Alternative: If you want to restrict to service role only, use:
-- CREATE POLICY "Service role can insert LGAs" ON public.lgas
--     FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');
