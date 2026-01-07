-- Add unique constraint to sources.url to allow upsert
ALTER TABLE public.sources ADD CONSTRAINT sources_url_key UNIQUE (url);
