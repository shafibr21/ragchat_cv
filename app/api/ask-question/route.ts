import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/db"
import { generateEmbedding, generateResponse } from "@/lib/gemini"
import { cosineSimilarity } from "@/lib/embeddings"

export async function POST(request: NextRequest) {
  try {
    const { question, documentId } = await request.json()

    if (!question || !documentId) {
      return NextResponse.json({ error: "Question and documentId are required" }, { status: 400 })
    }

    const supabase = await getSupabaseClient()

    // Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question)

    // Retrieve all embeddings for the document
    const { data: allEmbeddings, error: fetchError } = await supabase
      .from("embeddings")
      .select("chunk_text, embedding")
      .eq("document_id", documentId)

    if (fetchError || !allEmbeddings || allEmbeddings.length === 0) {
      return NextResponse.json({ error: "No embeddings found for this document" }, { status: 404 })
    }

    // Local similarity search
    const similarities = allEmbeddings.map((chunk: any) => ({
      text: chunk.chunk_text,
      similarity: cosineSimilarity(questionEmbedding, chunk.embedding),
    }))

    const relevantChunks = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .map((item) => item.text)

    const context = relevantChunks.join("\n\n")

    // Generate response using Gemini
    const answer = await generateResponse(question, context)

    // Store in chat history
    const { error: historyError } = await supabase.from("chat_history").insert([
      {
        question,
        answer,
        document_id: documentId,
      },
    ])

    if (historyError) {
      console.error("Error storing chat history:", historyError)
    }

    return NextResponse.json({
      success: true,
      question,
      answer,
      relevantChunks,
    })
  } catch (error) {
    console.error("Error asking question:", error)
    return NextResponse.json({ error: "Failed to process question" }, { status: 500 })
  }
}
