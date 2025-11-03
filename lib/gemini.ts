import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function generateResponse(prompt: string) {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate response");
  }
}

export async function streamResponse(prompt: string) {
  try {
    const result = await geminiModel.generateContentStream(prompt);
    return result.stream;
  } catch (error) {
    console.error("Gemini API Stream Error:", error);
    throw new Error("Failed to stream response");
  }
}
