import { apiClient } from './apiClient';

export interface TriagePayload {
  petName: string;
  species: string;
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
}

export const pawAiService = {
  async submitTriage(payload: TriagePayload) {
    return apiClient.post<TriageResult>('/pawai/triage', payload);
  },
};
