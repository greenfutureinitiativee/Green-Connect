# Quick Setup Guide - Populate Lagos LGA Data

## Problem
The database schema hasn't been updated yet, so the new columns (`contact_email`, `contact_phone`, etc.) don't exist.

## Solution - Choose One:

### Option 1: Via Supabase Dashboard (EASIEST) ✅

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/rdrkjkcvhjqwngmpcgld

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy the migration SQL:**
   - Open file: `supabase/migrations/008_add_lga_image_feed.sql`
   - Copy ALL the content

4. **Run the migration:**
   - Paste the SQL into the query editor
   - Click "Run" button
   - Wait for success message

5. **Populate the data:**
   ```bash
   npx tsx populate-lagos-data.ts
   ```

6. **View the data:**
   - Go to: http://localhost:5173/lga/Lagos/Ikeja
   - You should see real Ikeja LGA data!

---

### Option 2: Via Supabase CLI (if you have it installed)

```bash
cd supabase
supabase migration up
cd ..
npx tsx populate-lagos-data.ts
```

---

## What You'll Get

Once the migration runs successfully and you execute the population script, you'll see:

**Ikeja LGA Page with:**
- ✅ Chairman: Comrade Akeem Olalekan Dauda (AKOD)
- ✅ Population: 470,200
- ✅ Contact: +234 814 556 2287
- ✅ Office: 2 Obafemi Awolowo Way, Ikeja
- ✅ 5 Real Projects (road rehab, healthcare, solar lights, drainage, education)
- ✅ Budget breakdown across 7 categories
- ✅ 5 Politicians with contact info

**All 20 Lagos LGAs** listed in Explore page with real chairmen and budgets!

---

## Troubleshooting

If you still see "N/A" or empty data:
1. Check browser console for errors (F12)
2. Verify the migration ran (check Supabase dashboard > Table Editor > lgas table should have new columns)
3. Re-run the population script
4. Hard refresh the page (Ctrl + Shift + R)
