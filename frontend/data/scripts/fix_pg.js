require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
// Use the exact database URL from env
let connectionString = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('http://127.0.0.1:54321', 'postgresql://postgres:postgres@127.0.0.1:54322/postgres')
                                                             .replace('https://', 'postgresql://postgres:postgres@db.'); 
// Supabase cloud or local url. Let's just use the known local default for Supabase CLI if it's localhost
if(connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) {
    connectionString = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
}

const client = new Client({ connectionString });
async function run() {
  try {
    await client.connect();
    console.log("Connected PG");
    await client.query("ALTER TABLE people ADD COLUMN IF NOT EXISTS biography TEXT;");
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("Success add biography!");
  } catch(e) { console.error("Error PG:", e); }
  finally { await client.end(); }
}
run();
