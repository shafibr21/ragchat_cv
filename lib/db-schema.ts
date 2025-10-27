import { getSupabaseClient } from "./db"

export async function initializeDatabase() {
  try {
    const supabase = await getSupabaseClient()

    // Enable pgvector extension
    const { error: extensionError } = await supabase.rpc("enable_pgvector_extension")
    if (extensionError && !extensionError.message.includes("already exists")) {
      console.warn("Note: pgvector extension may need manual setup in Supabase dashboard")
    }

    // Create documents table
    const { error: docsError } = await supabase.from("documents").select("id").limit(1)
    if (docsError?.code === "PGRST116") {
      // Table doesn't exist, create it
      const { error } = await supabase.rpc("create_documents_table")
      if (error) console.error("Error creating documents table:", error)
    }

    // Create embeddings table
    const { error: embedError } = await supabase.from("embeddings").select("id").limit(1)
    if (embedError?.code === "PGRST116") {
      const { error } = await supabase.rpc("create_embeddings_table")
      if (error) console.error("Error creating embeddings table:", error)
    }

    // Create chat_history table
    const { error: chatError } = await supabase.from("chat_history").select("id").limit(1)
    if (chatError?.code === "PGRST116") {
      const { error } = await supabase.rpc("create_chat_history_table")
      if (error) console.error("Error creating chat_history table:", error)
    }

    console.log("Database schema initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}
