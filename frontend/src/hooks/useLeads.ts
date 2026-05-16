import { useState, useEffect, useCallback } from 'react';
import { Lead, LeadFilters, PaginationMeta } from '../types';
import { leadsApi } from '../api/leads';
import { useDebounce } from './useDebounce';
import toast from 'react-hot-toast';

export function useLeads(initialFilters: LeadFilters = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>({ page: 1, ...initialFilters });

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const result = await leadsApi.getLeads({ ...filters, search: debouncedSearch });
      setLeads(result.data);
      setPagination(result.pagination);
    } catch {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [filters, debouncedSearch]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const updateFilter = (updates: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: updates.page ?? 1 }));
  };

  const refresh = () => fetch();

  return { leads, pagination, loading, filters, updateFilter, refresh };
}
