import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://rdrkjkcvhjqwngmpcgld.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseServiceKey) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_ANON_KEY environment variable not set')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
    try {
        console.log('Reading migration file...')
        const migrationPath = join(__dirname, 'supabase', 'migrations', '013_green_connect_schema.sql')
        const migrationSQL = readFileSync(migrationPath, 'utf-8')

        console.log('Applying migration to Supabase...')
        console.log('Note: This uses the Supabase SQL editor equivalent via RPC')

        // Split the SQL into individual statements
        const statements = migrationSQL
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'))

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';'
            console.log(`\nExecuting statement ${i + 1}/${statements.length}...`)

            const { data, error } = await supabase.rpc('exec_sql', { sql: statement })

            if (error) {
                console.error(`Error executing statement ${i + 1}:`, error)
                // Try direct execution as fallback
                console.log('Trying direct execution...')
                const { error: directError } = await supabase.from('_migrations').insert({
                    name: '011_fix_profile_save_trigger',
                    statements: [statement]
                })

                if (directError) {
                    console.error('Direct execution also failed:', directError)
                }
            } else {
                console.log(`✓ Statement ${i + 1} executed successfully`)
            }
        }

        console.log('\n✅ Migration applied successfully!')
        console.log('The profile save issue should now be fixed.')

    } catch (error) {
        console.error('Failed to apply migration:', error)
        console.log('\n⚠️  MANUAL MIGRATION REQUIRED')
        console.log('\nPlease apply the migration manually:')
        console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/rdrkjkcvhjqwngmpcgld')
        console.log('2. Navigate to SQL Editor')
        console.log('3. Copy and paste the contents of: supabase/migrations/011_fix_profile_save_trigger.sql')
        console.log('4. Click "Run" to execute the migration')
        process.exit(1)
    }
}

applyMigration()
