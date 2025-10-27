"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

interface Message {
  id: string
  question: string
  answer: string
  relevantChunks: string[]
  timestamp: Date
}

interface ChatInterfaceProps {
  documentId: number
}

export default function ChatInterface({ documentId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchChatHistory()
  }, [documentId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat-history?documentId=${documentId}`)
      const data = await response.json()
      if (data.success) {
        const formattedMessages = data.history.map((item: any, index: number) => ({
          id: `${index}`,
          question: item.question,
          answer: item.answer,
          relevantChunks: [],
          timestamp: new Date(item.created_at),
        }))
        setMessages(formattedMessages.reverse())
      }
    } catch (error) {
      console.error("Error fetching chat history:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          documentId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        question: data.question,
        answer: data.answer,
        relevantChunks: data.relevantChunks,
        timestamp: new Date(),
      }

      setMessages([...messages, newMessage])
      setInput("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process question")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>No messages yet. Ask a question to get started!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* Question */}
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs">
                  <p className="text-sm">{message.question}</p>
                </div>
              </div>

              {/* Answer */}
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-900 rounded-lg px-4 py-2 max-w-xs">
                  <p className="text-sm">{message.answer}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="px-6 py-2 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4 bg-slate-50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the document..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading} className="px-6">
            {loading ? <Spinner className="h-4 w-4" /> : "Send"}
          </Button>
        </div>
      </form>
    </div>
  )
}
