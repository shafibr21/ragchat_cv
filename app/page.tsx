"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import PDFUploader from "@/components/pdf-uploader"
import ChatInterface from "@/components/chat-interface"

export default function Home() {
  const [documents, setDocuments] = useState<any[]>([])
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents")
      const data = await response.json()
      if (data.success) {
        setDocuments(data.documents)
        if (data.documents.length > 0 && !selectedDocumentId) {
          setSelectedDocumentId(data.documents[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    }
  }

  const handlePDFUploaded = () => {
    fetchDocuments()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">RAG Chatbot</h1>
          <p className="text-slate-600">Upload PDFs and ask questions about their content</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Documents</h2>

              <PDFUploader onUploadSuccess={handlePDFUploaded} />

              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Uploaded Documents</h3>
                <div className="space-y-2">
                  {documents.length === 0 ? (
                    <p className="text-sm text-slate-500">No documents uploaded yet</p>
                  ) : (
                    documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocumentId(doc.id)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedDocumentId === doc.id
                            ? "bg-blue-100 text-blue-900 border border-blue-300"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <p className="text-sm font-medium truncate">{doc.filename}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(doc.created_at).toLocaleDateString()}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedDocumentId ? (
              <ChatInterface documentId={selectedDocumentId} />
            ) : (
              <Card className="p-12 text-center">
                <p className="text-slate-600">Upload a PDF to get started</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
