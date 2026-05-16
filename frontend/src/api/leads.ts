import api from './client';
import { Lead, LeadFilters, LeadForm, LeadStats, PaginatedLeads } from '../types';

export const leadsApi = {
  getLeads: async (filters: LeadFilters): Promise<PaginatedLeads> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    const res = await api.get<PaginatedLeads>(`/leads?${params.toString()}`);
    return res.data;
  },

  getLead: async (id: string): Promise<Lead> => {
    const res = await api.get<{ success: boolean; data: Lead }>(`/leads/${id}`);
    return res.data.data;
  },

  createLead: async (data: LeadForm): Promise<Lead> => {
    const res = await api.post<{ success: boolean; data: Lead }>('/leads', data);
    return res.data.data;
  },

  updateLead: async (id: string, data: Partial<LeadForm>): Promise<Lead> => {
    const res = await api.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data);
    return res.data.data;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  getStats: async (): Promise<LeadStats> => {
    const res = await api.get<{ success: boolean; data: LeadStats }>('/leads/stats');
    return res.data.data;
  },

  exportCSV: async (filters: Omit<LeadFilters, 'page' | 'sortBy'>): Promise<void> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.set(k, String(v));
    });
    const res = await api.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([res.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
