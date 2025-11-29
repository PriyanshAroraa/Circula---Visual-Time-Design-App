import { GoogleGenAI, Type } from "@google/genai";
import { CategoryType } from "../types";

const initGenAI = () => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key is missing");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateSchedule = async (userRequest: string) => {
  const ai = initGenAI();
  if (!ai) throw new Error("API Key not found");

  const prompt = `
    Create a daily schedule based on the user's request: "${userRequest}".
    The schedule should be realistic and cover a 24-hour period where appropriate, but focusing on the active hours implied.
    Assign a category to each task from the following list: ${Object.values(CategoryType).join(', ')}.
    Return the result as a JSON array of tasks. 
    Use 24-hour format float for start and end times (e.g., 14.5 = 2:30 PM).
    Ensure tasks do not overlap significantly unless intentional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING, enum: Object.values(CategoryType) },
              startTime: { type: Type.NUMBER, description: "Start time in 0-24h float format" },
              endTime: { type: Type.NUMBER, description: "End time in 0-24h float format" },
              notes: { type: Type.STRING },
            },
            required: ["title", "category", "startTime", "endTime"],
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini scheduling failed:", error);
    throw error;
  }
};
