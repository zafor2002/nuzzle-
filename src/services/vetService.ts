import { apiClient } from './apiClient';
import type { Vet, Appointment } from '../types';

export const vetService = {
  async getDirectory(params?: { species?: string; emergency?: boolean }) {
    return apiClient.get<Vet[]>('/vet/directory', params);
  },

  async getAppointments() {
    return apiClient.get<Appointment[]>('/vet/appointments');
  },

  async bookAppointment(payload: {
    petId: string;
    petName: string;
    vetId: string;
    vetName: string;
    clinicName: string;
    date: string;
    time: string;
    reason: string;
  }) {
    return apiClient.post<Appointment>('/vet/appointments', payload);
  },
};
