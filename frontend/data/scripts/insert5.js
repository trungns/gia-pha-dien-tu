require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const sql = fs.readFileSync('data/02_insert_gen_5.sql', 'utf8');
  // Since supabase-js does not support executing raw multiple statements easily,
  // we will parse the queries and send them or just use psql.
  // Actually, we can just use psql via a different method:
  // psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -f data/02_insert_gen_5.sql
}
run();
