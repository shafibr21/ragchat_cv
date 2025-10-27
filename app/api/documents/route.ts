import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/db"

export async function GET() {
  try {
    const supabase = await getSupabaseClient()

    const { data: documents, error } = await supabase
      .from("documents")
      .select("id, filename, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching documents:", error)
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }

    return NextResponse.json({ success: true, documents })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
