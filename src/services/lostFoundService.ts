import { apiClient } from './apiClient';
import type { LostFoundPost } from '../types';

export const lostFoundService = {
  async getReports(filter?: string) {
    return apiClient.get<LostFoundPost[]>('/lost-found', filter ? { filter } : undefined);
  },

  async createReport(reportData: Partial<LostFoundPost>) {
    return apiClient.post<LostFoundPost>('/lost-found', reportData);
  },

  async claimRescue(reportId: string, volunteerName?: string) {
    return apiClient.post(`/lost-found/${reportId}/claim`, { volunteerName });
  },

  async matchLostFoundAi(data: { 
    description?: string; 
    sightingDescription?: string; 
    location?: string; 
    photoUrl?: string; 
    imageUrl?: string; 
    image?: string; 
    petType?: string; 
    breed?: string; 
  }) {
    return apiClient.post<any>('/lost-found/ai-match', data);
  },
};
