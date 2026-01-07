-- 019_add_lga_governance.sql
-- Add governance JSONB column to lgas table to store detailed "Parties Involved" data

ALTER TABLE public.lgas ADD COLUMN IF NOT EXISTS governance jsonb;

-- Add index for JSONB queries if we need to search inside governance (e.g., find all LGAs with 'APC' party)
CREATE INDEX IF NOT EXISTS idx_lgas_governance ON public.lgas USING gin (governance);

-- Grant permissions if necessary (though existing policies should cover it if they use 'public')
-- Just ensuring RLS policies allow reading this new column (usually `select *` covers it).
