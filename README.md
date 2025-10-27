# RAG Chatbot (ragchat_cv)

A Next.js + Supabase project that provides a Retrieval-Augmented Generation (RAG) chatbot for asking questions about uploaded PDF documents. It extracts embeddings from documents, stores them in Supabase (pgvector), and answers user queries using Google Gemini.

## Quick overview

- Framework: Next.js (TypeScript)
- Data store: Supabase (Postgres + pgvector)
- LLM: Google Gemini (via API key)
- Features: PDF upload & processing, embedding generation, vector similarity search, chat history, conversational UI

## Table of contents

- Features
- Requirements
- Setup (local)
- Environment variables
- Scripts
- Project structure
- API routes
- Development notes & contract
- Troubleshooting
- Next steps / Contributing

## Features

- Upload PDF documents and extract text
- Generate vector embeddings and store them in Supabase (pgvector)
- Ask natural-language questions about documents
- Vector similarity retrieval + Google Gemini for answers
- Chat history per session
- Responsive UI components and file uploader

## Requirements

- Node.js 18+
- pnpm or npm
- A Supabase project with pgvector extension enabled
- Google Gemini API key

## Setup (local)

1. Clone the repo

   ```powershell
   git clone <your-repo-url>
   cd ragchat_cv
   ```

2. Install dependencies

   ```powershell
   # npm
   npm install

   # or pnpm
   pnpm install
   ```

3. Create a `.env.local` in the project root with the variables below (example):

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
   SUPABASE_SERVICE_ROLE_KEY=service-role-key
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   ```

   Notes:

   - `SUPABASE_SERVICE_ROLE_KEY` must be kept secret and used only on server side (not in browser).
   - `NEXT_PUBLIC_` prefixed keys are safe to expose to the browser where required.

4. Initialize the Supabase database/tables

   Option A — Run the provided script (recommended):

   ```powershell
   npx ts-node scripts/init-supabase.ts
   ```

   Option B — Run the SQL manually:

   1. Open Supabase SQL Editor
   2. Copy `scripts/setup-supabase.sql` and execute it

5. Start the dev server

   ```powershell
   npm run dev
   # or
   pnpm dev
   ```

Open http://localhost:3000

## Environment variables (summary)

- NEXT_PUBLIC_SUPABASE_URL — Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY — Supabase public anon key
- SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (server-only)
- GOOGLE_GEMINI_API_KEY — API key for Google Gemini

Add any other environment variables you add in `app/api` or `lib/supabase` to `.env.local` accordingly.

## Scripts (from package.json)

- dev: next dev
- build: next build
- start: next start
- lint: eslint .

Use `npm run <script>` or `pnpm <script>` as preferred.

## Project structure (high-level)

- `app/` — Next.js app routes & API handlers (App Router)
  - `api/ask-question/route.ts` — Ask the model a question (server)
  - `api/chat-history/route.ts` — Chat history endpoints
  - `api/documents/route.ts` — Document listing endpoints
  - `api/upload-pdf/route.ts` — PDF upload & processing
- `components/` — React UI components used by pages
  - `chat-interface.tsx`, `pdf-uploader.tsx`, `theme-provider.tsx`
- `lib/` — backend helpers
  - `embeddings.ts`, `gemini.ts`, `pdf-processor.ts`, `supabase/*`
- `scripts/` — convenience scripts (DB init, supabase init)
- `styles/` — global styles

## API routes

This project exposes server-side API routes under `app/api` for the main functionality:

- POST `/api/upload-pdf` — Upload PDF bytes; the server extracts text, creates embeddings, and stores document chunks and embeddings in Supabase.
- POST `/api/ask-question` — Given a question and optional context, performs vector retrieval and calls Gemini for an answer.
- GET/POST `/api/chat-history` — Save and retrieve chat history.
- GET `/api/documents` — List stored documents and metadata.

Refer to the route handlers in `app/api/*/route.ts` for the exact request/response shapes.

## Developer contract (small)

- Inputs:
  - Uploaded PDF bytes (multipart/form-data)
  - Question text in JSON payload to ask endpoint
- Outputs:
  - Stored document chunks and embeddings in Supabase
  - JSON responses with retrieved passages and LLM answer
- Error modes:
  - Missing or invalid environment variables -> 500 with diagnostic message
  - Upload/processing failures -> 4xx/5xx with helpful message in response
  - LLM API errors -> bubbled as 502 or 500 depending on handler

## Edge cases to consider

- Very large PDFs may hit memory/time limits — consider chunk limits and timeouts.
- Missing or rotated pages in PDFs — OCR may be needed for some files.
- Inconsistent or missing API keys in deployment — deployment env vars must be set.
- PGVector extension not enabled — vector storage/queries will fail.

## Troubleshooting

- "Missing Supabase environment variables": ensure `.env.local` exists and keys are correct.
- "No embeddings found": verify the upload completed and the `documents` / `embeddings` tables contain rows.
- "Vector search not working": enable pgvector in Supabase and confirm migrations or SQL were applied.
- "GOOGLE_GEMINI_API_KEY is not set": set the key and restart the server.
- PDF parse issues: the project uses `pdf-parse` or a fork; if you see import shape issues, use a dynamic import (see `SETUP_INSTRUCTIONS.md` notes).

## Deployment notes

- This app is suitable for deployment on Vercel. When deploying, set the same environment variables in the Vercel project settings.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only (Vercel environment variable without exposing to client).

## Running quick checks

After installing and setting up env vars & DB, run locally:

```powershell
npm run dev
# open http://localhost:3000
```

To run a build locally:

```powershell
npm run build
npm run start
```

## Contributing / Next steps

- Add tests for API endpoints (recommended: Jest / Playwright for end-to-end)
- Add CI to run lint/build/tests
- Improve error handling and add telemetry for failed uploads/LLM errors

## License

No license specified in this repository. If you want to open-source this project, add a LICENSE file (for example, MIT).

---

If you'd like, I can:

- Add a troubleshooting section tailored to specific errors you saw locally
- Add a sample `.env.local.example` and a small script to validate environment variables
- Create a tiny verification script that pings the API routes to ensure they return expected statuses

Tell me which follow-up you'd like and I will implement it.
