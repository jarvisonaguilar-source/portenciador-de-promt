import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export enum PromptTechnique {
  ZERO_SHOT = "Zero-Shot",
  FEW_SHOT = "Few-Shot",
  CHAIN_OF_THOUGHT = "Chain of Thought"
}

export interface PromptAnalysis {
  precision: number; // 0 to 100
  strengths: string[];
  weaknesses: string[];
  missingElements: string[]; // Role, Task, Context, Format
}

export interface RefinedPrompt {
  improvedPrompt: string;
  explanation: string;
  role: string;
  task: string;
  context: string;
  format: string;
}

export class GeminiService {
  static async analyzePrompt(prompt: string): Promise<PromptAnalysis> {
    const systemInstruction = `Eres un experto en ingeniería de prompts. 
    Analiza el prompt del usuario y proporciona una puntuación de precisión (0-100) y un análisis detallado.
    Busca específicamente la presencia de: Rol, Tarea, Contexto y Formato de salida.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analiza este prompt: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            precision: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingElements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["precision", "strengths", "weaknesses", "missingElements"],
        },
      },
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Error parsing analysis JSON", e);
      return {
        precision: 0,
        strengths: [],
        weaknesses: ["Error al procesar el análisis"],
        missingElements: []
      };
    }
  }

  static async refinePrompt(
    prompt: string, 
    technique: PromptTechnique, 
    taskType: string
  ): Promise<RefinedPrompt> {
    const systemInstruction = `Eres un experto en optimización de prompts. 
    Tu objetivo es mejorar el prompt del usuario aplicando la técnica "${technique}" para una tarea de tipo "${taskType}".
    Debes seguir estrictamente la estructura: ROL + TAREA + CONTEXTO + FORMATO DE SALIDA.
    
    Técnica "${PromptTechnique.ZERO_SHOT}": Mejora la claridad y las instrucciones directas sin ejemplos.
    Técnica "${PromptTechnique.FEW_SHOT}": Incluye marcadores de posición razonables para ejemplos [EJEMPLO 1], [EJEMPLO 2] para que el usuario los complete.
    Técnica "${PromptTechnique.CHAIN_OF_THOUGHT}": Añade instrucciones explícitas para que la IA "piense paso a paso" y desglose el problema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Prompt original: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improvedPrompt: { type: Type.STRING },
            explanation: { type: Type.STRING },
            role: { type: Type.STRING },
            task: { type: Type.STRING },
            context: { type: Type.STRING },
            format: { type: Type.STRING },
          },
          required: ["improvedPrompt", "explanation", "role", "task", "context", "format"],
        },
      },
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Error parsing refinement JSON", e);
      throw new Error("No se pudo refinar el prompt.");
    }
  }
}
