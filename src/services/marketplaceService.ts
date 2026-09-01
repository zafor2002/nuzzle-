import { apiClient } from './apiClient';
import type { MarketplaceListing } from '../types';

export const marketplaceService = {
  async getListings(category?: string) {
    return apiClient.get<MarketplaceListing[]>('/marketplace', category ? { category } : undefined);
  },

  async createListing(data: Partial<MarketplaceListing>) {
    return apiClient.post<MarketplaceListing>('/marketplace', data);
  },
};
