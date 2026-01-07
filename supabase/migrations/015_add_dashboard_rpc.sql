-- Function to get aggregated financial summary for an LGA
CREATE OR REPLACE FUNCTION get_lga_financial_summary(p_lga_id uuid)
RETURNS jsonb LANGUAGE sql AS $$
  SELECT jsonb_build_object(
    'lga', (SELECT jsonb_build_object('id', id, 'name', name, 'state', state) FROM lgas WHERE id = p_lga_id),
    'allocations', (
        SELECT COALESCE(jsonb_agg(a ORDER BY period DESC), '[]'::jsonb)
        FROM (
            SELECT * FROM lga_allocations WHERE lga_id = p_lga_id LIMIT 24
        ) a
    ),
    'spendings', (
        SELECT COALESCE(jsonb_agg(s ORDER BY date DESC), '[]'::jsonb)
        FROM (
            SELECT * FROM lga_spendings WHERE lga_id = p_lga_id LIMIT 50
        ) s
    ),
    'projects', (
        SELECT COALESCE(jsonb_agg(p ORDER BY fetched_at DESC), '[]'::jsonb)
        FROM lga_projects p WHERE p.lga_id = p_lga_id
    )
  );
$$;
