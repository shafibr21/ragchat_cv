import { generateEmbedding } from "./gemini"

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = []

  for (const text of texts) {
    const embedding = await generateEmbedding(text)
    embeddings.push(embedding)
  }

  return embeddings
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export function findMostSimilarChunks(
  queryEmbedding: number[],
  chunkEmbeddings: Array<{ text: string; embedding: number[] }>,
  topK = 3,
): string[] {
  const similarities = chunkEmbeddings.map((chunk) => ({
    text: chunk.text,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
  }))

  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map((item) => item.text)
}
