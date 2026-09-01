import { apiClient } from './apiClient';
import type { AdoptionListing } from '../types';

export const adoptionService = {
  async getAdoptions(species?: string) {
    return apiClient.get<AdoptionListing[]>('/adoption', species ? { species } : undefined);
  },

  async createAdoption(data: Partial<AdoptionListing>) {
    return apiClient.post<AdoptionListing>('/adoption', data);
  },
};
