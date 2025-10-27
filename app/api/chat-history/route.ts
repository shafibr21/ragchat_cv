import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseClient()
    const documentId = request.nextUrl.searchParams.get("documentId")

    let query = supabase.from("chat_history").select("id, question, answer, created_at")

    if (documentId) {
      query = query.eq("document_id", Number.parseInt(documentId))
    }

    const { data: history, error } = await query.order("created_at", { ascending: false }).limit(50)

    if (error) {
      console.error("Error fetching chat history:", error)
      return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 })
    }

    return NextResponse.json({ success: true, history })
  } catch (error) {
    console.error("Error fetching chat history:", error)
    return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 })
  }
}
