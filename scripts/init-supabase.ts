import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function initializeDatabase() {
  console.log("Initializing Supabase database...")

  try {
    // Enable pgvector extension
    console.log("Enabling pgvector extension...")
    await supabase.rpc("execute_sql", {
      sql: "CREATE EXTENSION IF NOT EXISTS vector;",
    })

    // Create documents table
    console.log("Creating documents table...")
    const { error: docsError } = await supabase.from("documents").select("id").limit(1)
    if (docsError?.code === "PGRST116") {
      // Table doesn't exist, create it
      await supabase.rpc("execute_sql", {
        sql: `
          CREATE TABLE IF NOT EXISTS documents (
            id BIGSERIAL PRIMARY KEY,
            filename VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `,
      })
    }

    // Create embeddings table
    console.log("Creating embeddings table...")
    await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS embeddings (
          id BIGSERIAL PRIMARY KEY,
          document_id BIGINT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
          chunk_text TEXT NOT NULL,
          embedding vector(768),
          chunk_index INT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `,
    })

    // Create chat_history table
    console.log("Creating chat_history table...")
    await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS chat_history (
          id BIGSERIAL PRIMARY KEY,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          document_id BIGINT REFERENCES documents(id) ON DELETE SET NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `,
    })

    console.log("Database initialization completed successfully!")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

initializeDatabase()
