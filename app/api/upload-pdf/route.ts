import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/db"
import { extractTextFromPDF, chunkText } from "@/lib/pdf-processor"
import { generateEmbeddings } from "@/lib/embeddings"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!file.name.endsWith(".pdf")) {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 })
    }

    const supabase = await getSupabaseClient()

    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfText = await extractTextFromPDF(buffer)

    // Insert document into database
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .insert([{ filename: file.name, content: pdfText }])
      .select()

    if (docError) {
      console.error("Error inserting document:", docError)
      return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
    }

    const documentId = docData[0].id

    // Chunk the text
    const chunks = chunkText(pdfText)

    // Generate embeddings for chunks
    const embeddings = await generateEmbeddings(chunks)

    // Store embeddings in database
    const embeddingsData = chunks.map((chunk, i) => ({
      document_id: documentId,
      chunk_text: chunk,
      embedding: embeddings[i],
      chunk_index: i,
    }))

    const { error: embedError } = await supabase.from("embeddings").insert(embeddingsData)

    if (embedError) {
      console.error("Error inserting embeddings:", embedError)
      return NextResponse.json({ error: "Failed to store embeddings" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      documentId,
      message: `PDF uploaded successfully with ${chunks.length} chunks`,
    })
  } catch (error) {
    console.error("Error uploading PDF:", error)
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
  }
}
