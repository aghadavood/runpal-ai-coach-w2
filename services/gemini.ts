import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let ai: GoogleGenAI | null = null;
let chatSession: any = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const initializeChat = async () => {
  const aiInstance = getAI();
  try {
    chatSession = aiInstance.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Warm and creative
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to initialize chat", error);
    return false;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini", error);
    return "I'm having a little trouble connecting right now, but I'm still cheering you on! 🏃‍♀️";
  }
};

export const analyzeRunPhoto = async (base64Data: string, mimeType: string = 'image/jpeg'): Promise<{mood: string, photo_note: string, memory: string}> => {
  const aiInstance = getAI();
  try {
      const response = await aiInstance.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
              parts: [
                  { inlineData: { mimeType, data: base64Data } },
                  { text: "Analyze this running photo. Context: The user just finished a run. Identify the mood, describe the photo, and write a short first-person memory/caption." }
              ]
          },
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      mood: { 
                        type: Type.STRING, 
                        enum: ['strong', 'happy', 'determined', 'amazing', 'tired', 'neutral'],
                        description: "The emotional vibe of the photo"
                      },
                      photo_note: { 
                        type: Type.STRING, 
                        description: "A short, objective visual description of the photo (e.g., 'Smiling selfie with sunset', 'Muddy shoes on pavement')" 
                      },
                      memory: { 
                        type: Type.STRING, 
                        description: "A short, warm, first-person reflection on the run based on the visual vibe (e.g., 'The rain felt refreshing today.')" 
                      }
                  }
              }
          }
      });
      
      if (response.text) {
        return JSON.parse(response.text);
      }
      throw new Error("No response generated");
  } catch (e) {
      console.error("Analysis failed", e);
      return { 
        mood: 'happy', 
        photo_note: 'A new memory captured', 
        memory: 'Another run in the books! Feeling accomplished.' 
      };
  }
};
