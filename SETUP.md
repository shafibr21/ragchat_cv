# RAG Chatbot Setup Guide

## Prerequisites
- Node.js 18+
- A Supabase account (free tier available at https://supabase.com)
- Google Gemini API key

## Setup Steps

### 1. Create Supabase Project
1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait for the project to be provisioned
4. Go to Project Settings > API to get your credentials

### 2. Set Environment Variables
Create a `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_GEMINI_API_KEY=AIzaSyBz5Xh5F7e0F2w8TWuzgI1B8-yVX4AxC5I
\`\`\`

### 3. Initialize Database
1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `scripts/setup-supabase.sql`
5. Paste it into the SQL editor
6. Click "Run"

### 4. Install Dependencies
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### 5. Run Development Server
\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

Visit http://localhost:3000 to use the chatbot.

## Deployment to Vercel

### 1. Push to GitHub
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_GEMINI_API_KEY`
5. Click "Deploy"

Your RAG Chatbot will be live!

## Features
- Upload PDF documents
- Ask questions about document content
- Get AI-powered answers using Google Gemini
- Vector similarity search using pgvector
- Chat history tracking
- Responsive UI

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure `.env.local` file exists with correct credentials
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set

### "No embeddings found for this document"
- Ensure the PDF was uploaded successfully
- Check that the database tables were created properly

### Vector search not working
- Verify pgvector extension is enabled in Supabase
- Check that the `match_embeddings` function was created
