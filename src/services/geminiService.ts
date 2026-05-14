import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askOceanAssistant(prompt: string, context: string = "") {
  try {
    const systemPrompt = `You are "AQUA", the advanced AI guide for DeepOcean X. 
    You are an expert marine biologist, oceanographer, and historian.
    Your tone is mysterious, professional, yet deeply passionate about the ocean.
    You use scientific terms but explain them in a way that feels cinematic.
    Current context: ${context}
    
    Keep responses concise and immersive. Use Markdown for formatting.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [systemPrompt, prompt],
    });
    
    return response.text || "The deep sea currents are disrupting my transmission. Please retry, explorer.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "The deep sea currents are disrupting my transmission. Please retry, explorer.";
  }
}
