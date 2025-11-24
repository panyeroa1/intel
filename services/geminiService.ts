import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { ModelType } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not found in environment");
  return new GoogleGenAI({ apiKey });
};

// --- Standard Generation ---

export const generateText = async (prompt: string, fast: boolean = false) => {
  const ai = getClient();
  const model = fast ? ModelType.TEXT_FAST : ModelType.TEXT_SMART;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
        // Lower latency for flash lite
        thinkingConfig: fast ? { thinkingBudget: 0 } : undefined
    }
  });
  return response.text;
};

export const analyzeImage = async (base64Image: string, prompt: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: ModelType.TEXT_SMART, // gemini-3-pro-preview for analysis
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    }
  });
  return response.text;
};

// --- Grounding ---

export const generateWithSearch = async (prompt: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: ModelType.GROUNDING_SEARCH,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response;
};

export const generateWithMaps = async (prompt: string, lat: number, lng: number) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: ModelType.GROUNDING_MAPS,
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    },
  });
  return response;
};

// --- Image Generation & Editing ---

export const generateImagePro = async (prompt: string, config: { size: '1K'|'2K'|'4K', aspectRatio: string }) => {
  const ai = getClient();
  
  // Must check/select key for Pro models if using features that require user selection, 
  // but for generic generation we use env key. 
  // NOTE: Guidelines say gemini-3-pro-image-preview with size config.
  
  const response = await ai.models.generateContent({
    model: ModelType.IMAGE_GEN_HQ,
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        imageSize: config.size,
        aspectRatio: config.aspectRatio
      }
    }
  });
  
  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getClient();
  // Using Nano Banana (Flash Image) for editing
  const response = await ai.models.generateContent({
    model: ModelType.IMAGE_GEN_EDIT,
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/png', data: base64Image } },
        { text: prompt }
      ]
    }
  });
    
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

// --- Live API Connector ---

export const connectLiveSession = async (
  onOpen: () => void,
  onMessage: (msg: LiveServerMessage) => void,
  onClose: () => void,
  onError: (e: ErrorEvent) => void
) => {
  const ai = getClient();
  return ai.live.connect({
    model: ModelType.LIVE_AUDIO,
    callbacks: {
      onopen: onOpen,
      onmessage: onMessage,
      onclose: onClose,
      onerror: onError,
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } // Eburon voice
      },
      systemInstruction: "You are Eburon. A unified intelligence layer. Precise, authoritative, human-like. You manage conversation, code, and ops. Keep responses concise.",
    }
  });
};