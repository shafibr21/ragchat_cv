// Script to initialize Supabase database
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function initializeDatabase() {
  try {
    console.log("Initializing Supabase database...")

    // Check if tables exist by trying to query them
    const { error: docsError } = await supabase.from("documents").select("id").limit(1)
    const { error: embedError } = await supabase.from("embeddings").select("id").limit(1)
    const { error: chatError } = await supabase.from("chat_history").select("id").limit(1)

    if (!docsError && !embedError && !chatError) {
      console.log("Database tables already exist!")
      return
    }

    console.log("Please run the SQL setup script in your Supabase dashboard:")
    console.log("1. Go to SQL Editor in Supabase dashboard")
    console.log("2. Create a new query")
    console.log("3. Copy and paste the contents of scripts/setup-supabase.sql")
    console.log("4. Run the query")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

initializeDatabase()
