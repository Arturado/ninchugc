import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export const chatWithGemini = async (message: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: "Eres NINCH AI, un asistente virtual experto en NINCH. NINCH es una plataforma que conecta marcas líderes con creadores de contenido estratégicos. Tu tono es profesional, innovador, directo y amigable. Ayudas a los usuarios a entender cómo funciona la plataforma, los beneficios de las conexiones entre marcas y creadores, y cómo sumarse. Responde siempre en español de forma concisa y clara.",
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lo siento, tuve un problema al procesar tu mensaje. ¿Podrías intentarlo de nuevo?";
  }
};
