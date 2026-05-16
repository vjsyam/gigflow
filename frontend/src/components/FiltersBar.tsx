import { LeadFilters, LeadSource, LeadStatus } from '../types';
import { leadsApi } from '../api/leads';
import toast from 'react-hot-toast';

interface FiltersBarProps {
  filters: LeadFilters;
  onChange: (updates: Partial<LeadFilters>) => void;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

export function FiltersBar({ filters, onChange }: FiltersBarProps) {
  const handleExport = async () => {
    const t = toast.loading('Exporting CSV...');
    try {
      await leadsApi.exportCSV({ status: filters.status, source: filters.source, search: filters.search });
      toast.success('CSV downloaded!', { id: t });
    } catch {
      toast.error('Export failed', { id: t });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
        <input
          className="input pl-9"
          placeholder="Search name or email..."
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </div>

      {/* Status filter */}
      <select
        className="input w-auto min-w-32"
        value={filters.status || ''}
        onChange={(e) => onChange({ status: (e.target.value as LeadStatus) || undefined })}
      >
        <option value="">All Status</option>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Source filter */}
      <select
        className="input w-auto min-w-32"
        value={filters.source || ''}
        onChange={(e) => onChange({ source: (e.target.value as LeadSource) || undefined })}
      >
        <option value="">All Sources</option>
        {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Sort */}
      <select
        className="input w-auto min-w-28"
        value={filters.sortBy || 'latest'}
        onChange={(e) => onChange({ sortBy: e.target.value as 'latest' | 'oldest' })}
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
      </select>

      {/* Export */}
      <button
        onClick={() => void handleExport()}
        className="btn-ghost border border-[var(--border)] text-sm gap-2 flex items-center"
      >
        <span>↓</span> Export CSV
      </button>
    </div>
  );
}
