"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface PDFUploaderProps {
  onUploadSuccess: () => void
}

export default function PDFUploader({ onUploadSuccess }: PDFUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      onUploadSuccess()
      event.target.value = ""
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <label className="block">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
          id="pdf-input"
        />
        <Button asChild disabled={loading} className="w-full cursor-pointer">
          <label htmlFor="pdf-input" className="cursor-pointer">
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              "Upload PDF"
            )}
          </label>
        </Button>
      </label>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  )
}
