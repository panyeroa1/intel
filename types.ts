export enum ModelType {
  LIVE_AUDIO = 'gemini-2.5-flash-native-audio-preview-09-2025',
  TEXT_FAST = 'gemini-2.5-flash-lite-latest', // Fast response
  TEXT_SMART = 'gemini-3-pro-preview', // Complex reasoning
  IMAGE_GEN_EDIT = 'gemini-2.5-flash-image', // "Nano Banana"
  IMAGE_GEN_HQ = 'gemini-3-pro-image-preview', // "Nano Banana Pro"
  GROUNDING_SEARCH = 'gemini-2.5-flash', // With Search Tool
  GROUNDING_MAPS = 'gemini-2.5-flash', // With Maps Tool
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  image?: string; // base64
  groundingSources?: GroundingSource[];
  timestamp: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
  sourceType: 'web' | 'map';
}

export interface ImageGenConfig {
  aspectRatio: '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';
  size: '1K' | '2K' | '4K';
  prompt: string;
  refImage?: string; // base64
}

// Live API Types
export interface PCMData {
  data: string; // Base64 encoded pcm
  mimeType: string;
}