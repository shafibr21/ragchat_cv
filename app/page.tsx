"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import PDFUploader from "@/components/pdf-uploader"
import ChatInterface from "@/components/chat-interface"
import { FileText, Sparkles, File } from "lucide-react"

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
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-2 md:p-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            RAG Chatbot
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your PDF documents and have intelligent conversations about their content
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 backdrop-blur-sm bg-white/90 shadow-xl border-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Documents</h2>
              </div>

              <PDFUploader onUploadSuccess={handlePDFUploaded} />

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <File className="h-4 w-4" />
                  Uploaded Documents
                  {documents.length > 0 && (
                    <span className="ml-auto text-xs bg-linear-to-r from-blue-500 to-purple-500 text-white px-2.5 py-1 rounded-full font-medium shadow-sm">
                      {documents.length}
                    </span>
                  )}
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {documents.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <div className="w-16 h-16 bg-linear-to-br from-slate-100 to-slate-200 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-600 font-medium">No documents uploaded yet</p>
                      <p className="text-xs text-slate-500 mt-1">Upload your first PDF to get started</p>
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocumentId(doc.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                          selectedDocumentId === doc.id
                            ? "bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-[1.02]"
                            : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            selectedDocumentId === doc.id
                              ? "bg-white/20"
                              : "bg-blue-100 group-hover:bg-blue-200"
                          }`}>
                            <FileText className={`h-4 w-4 ${
                              selectedDocumentId === doc.id ? "text-white" : "text-blue-600"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.filename}</p>
                            <p className={`text-xs mt-1 ${
                              selectedDocumentId === doc.id ? "text-white/80" : "text-slate-500"
                            }`}>
                              {new Date(doc.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
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
              <div className="backdrop-blur-sm bg-white/90 shadow-xl border-0 rounded-xl overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-purple-600 p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">Chat with Document</h3>
                      <p className="text-blue-100 text-xs truncate">
                        {documents.find(d => d.id === selectedDocumentId)?.filename}
                      </p>
                    </div>
                  </div>
                </div>
                <ChatInterface documentId={selectedDocumentId} />
              </div>
            ) : (
              <Card className="backdrop-blur-sm bg-white/90 flex items-center justify-center shadow-xl border-0 min-h-[500px] rounded-xl">
                <div className="text-center p-12">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-inner">
                    <FileText className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    Ready to start chatting?
                  </h3>
                  <p className="text-slate-600 mb-1">Upload a PDF document to begin</p>
                  <p className="text-sm text-slate-500">
                    Your document will appear in the sidebar
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}