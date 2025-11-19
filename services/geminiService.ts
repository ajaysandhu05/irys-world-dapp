
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

export const generatePostSuggestion = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an AI assistant for a social media platform called Irys World. A user wants to write a post.
            Based on their idea, generate a creative and engaging social media post.
            The post should be concise, use relevant hashtags, and have a positive tone.
            User's idea: "${prompt}"`,
        });

        const text = response.text;
        if (!text) {
            throw new Error("No content generated.");
        }
        return text.trim();
    } catch (error) {
        console.error("Error generating content with Gemini:", error);
        throw new Error("Failed to generate AI suggestion. Please try again.");
    }
};
