import { GoogleGenAI, Type } from "@google/genai";
import { Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      description: "An array of multiple-choice questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The question text."
          },
          options: {
            type: Type.ARRAY,
            description: "An array of 3 possible answers (2 incorrect, 1 correct).",
            items: {
              type: Type.STRING
            }
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The correct answer from the options array."
          }
        },
        required: ["question", "options", "correctAnswer"]
      }
    }
  },
  required: ["questions"]
};

export const generateQuestions = async (): Promise<Question[]> => {
  try {
    const prompt = `You are an expert quiz creator. Generate a fun and engaging General Knowledge (GK) quiz with at least 20 multiple-choice questions suitable for a broad audience. Cover a variety of topics like history, science, pop culture, geography, and arts.

Each question must have exactly 3 options: one correct answer and two plausible but incorrect distractors. The options should be concise and relevant. Ensure the value for 'correctAnswer' is an exact match to one of the values in the 'options' array.

Return the output in JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonResponse = JSON.parse(response.text);
    
    if (!jsonResponse.questions || jsonResponse.questions.length === 0) {
        throw new Error("AI failed to generate questions. There might be a temporary issue.");
    }
    
    // FIX: Added validation to ensure correctAnswer is one of the options.
    // This prevents questions that are impossible to answer correctly.
    return jsonResponse.questions.filter((q: any): q is Question => 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length === 3 && 
        q.correctAnswer &&
        q.options.includes(q.correctAnswer)
    );

  } catch (error) {
    console.error("Error generating questions:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate a GK quiz. Details: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the quiz.");
  }
};