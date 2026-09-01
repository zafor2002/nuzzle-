import { apiClient } from './apiClient';
import type { Pet } from '../types';

export const petService = {
  async getPets(ownerId?: string) {
    return apiClient.get<Pet[]>('/pets', ownerId ? { ownerId } : undefined);
  },

  async getPetById(id: string) {
    return apiClient.get<Pet>(`/pets/${id}`);
  },

  async createPet(petData: Partial<Pet>) {
    return apiClient.post<Pet>('/pets', petData);
  },

  async updatePet(id: string, updates: Partial<Pet>) {
    return apiClient.put<Pet>(`/pets/${id}`, updates);
  },

  async deletePet(id: string) {
    return apiClient.delete(`/pets/${id}`);
  },
};
