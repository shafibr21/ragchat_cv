# RAG Chatbot Setup Instructions

## Prerequisites

- Node.js 18+
- A Supabase account (free tier available at https://supabase.com)
- Google Gemini API key

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Create a new project
3. Wait for the project to be provisioned
4. Go to Project Settings > API to get your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (keep this secret!)

## Step 2: Set Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
\`\`\`

## Step 3: Initialize Database

Run the setup script to create tables and enable pgvector:

\`\`\`bash
npx ts-node scripts/init-supabase.ts
\`\`\`

Or manually run the SQL from `scripts/setup-supabase.sql` in your Supabase SQL editor.

## Step 4: Install Dependencies

\`\`\`bash
npm install

# or

pnpm install
\`\`\`

## Step 5: Run Development Server

\`\`\`bash
npm run dev

# or

pnpm dev
\`\`\`

Open http://localhost:3000 in your browser.

## Step 6: Upload a PDF and Test

1. Click "Upload PDF" button
2. Select a PDF file
3. Wait for processing to complete
4. Ask questions about the PDF content
5. The chatbot will retrieve relevant sections and generate answers using Gemini

## Deployment to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com and import your repository
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_GEMINI_API_KEY`
4. Deploy!

## Troubleshooting

### "Could not find the table 'public.documents'"

- Run the initialization script: `npx ts-node scripts/init-supabase.ts`
- Or manually execute the SQL in `scripts/setup-supabase.sql`

### "pdfParse is not a function"

- Ensure `pdf-parse` is installed: `npm install pdf-parse`
- Note: `pdf-parse` may be published with different module shapes (CommonJS vs ESM). If you see an import error about a missing default export, use a dynamic import or access the module's default export at runtime. For example:

```ts
const pdfModule = (await import("pdf-parse")) as any;
const pdfParse = pdfModule?.default ?? pdfModule;
const data = await pdfParse(buffer);
```

This handles both CommonJS and ESM exports.

### "GOOGLE_GEMINI_API_KEY is not set"

- Add your Gemini API key to `.env.local`
- Restart the development server
