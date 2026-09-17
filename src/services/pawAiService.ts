import { apiClient } from './apiClient';

export interface TriagePayload {
  petName: string;
  species: string;
  breed?: string;
  age?: string;
  symptoms: string;
  duration?: string;
  isProSubscriber?: boolean;
}

export interface TriageResult {
  triageId: string;
  petName: string;
  species: string;
  urgency: 'low' | 'moderate' | 'emergency';
  urgencyLabel: string;
  urgencyColor: string;
  summary: string;
  recommendedActions: string[];
  redFlags: string[];
  recommendedClinic: {
    id: string;
    name: string;
    clinicName: string;
    phone: string;
    location: string;
    isProPriority: boolean;
  };
  disclaimer: string;
  createdAt: string;
  provider?: string;
}

export interface ChatMessageItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatPayload {
  messages: ChatMessageItem[];
  petContext?: {
    petName?: string;
    species?: string;
    breed?: string;
    age?: string;
    weight?: string;
    isProSubscriber?: boolean;
  };
}

export interface ChatResult {
  reply: string;
  suggestedQuestions?: string[];
  urgency?: 'low' | 'moderate' | 'emergency';
  provider: string;
  timestamp: string;
}

export interface PetScanPayload {
  image: string;
  species?: string;
  petType?: string;
  breed?: string;
  petName?: string;
}

export interface PetScanResult {
  breedMatch: string;
  confidence: number;
  detectedMood: string;
  healthObservations: string[];
  nutritionAdvice: string;
  funFact: string;
  provider?: string;
}

export const pawAiService = {
  async submitTriage(payload: TriagePayload) {
    return apiClient.post<TriageResult>('/pawai/triage', payload);
  },

  async sendChat(payload: ChatPayload) {
    return apiClient.post<ChatResult>('/pawai/chat', payload);
  },

  async scanPet(payload: PetScanPayload) {
    return apiClient.post<PetScanResult>('/pawai/scan', payload);
  },
};
