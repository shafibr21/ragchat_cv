import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, embed } from "ai";

const GEMINI_EMBEDDING_MODEL = "text-embedding-004";
const GEMINI_GENERATION_MODEL = "gemini-2.0-flash-exp";

// Get API key from environment
const apiKey =
  process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  throw new Error(
    "Google Gemini API key is missing. Set GOOGLE_GEMINI_API_KEY in your .env.local file."
  );
}

// Configure the Google provider with the API key
const google = createGoogleGenerativeAI({
  apiKey: apiKey,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const { embedding } = await embed({
      model: google.textEmbeddingModel(GEMINI_EMBEDDING_MODEL),
      value: text,
    });
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

export async function generateResponse(
  question: string,
  context: string
): Promise<string> {
  try {
    const { text } = await generateText({
      model: google(GEMINI_GENERATION_MODEL),
      prompt: `You are a helpful assistant answering questions based on the provided document context.

Context from document:
${context}

User Question: ${question}

Please provide a clear and accurate answer based on the context provided. If the answer is not found in the context, say "I couldn't find the answer in the provided document."`,
    });

    return text;
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response");
  }
}
