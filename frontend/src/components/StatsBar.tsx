import { useEffect, useState } from 'react';
import { leadsApi } from '../api/leads';
import { LeadStats } from '../types';
import { StatSkeleton } from './Skeleton';

const statusColors: Record<string, string> = {
  New: 'text-blue-400',
  Contacted: 'text-yellow-400',
  Qualified: 'text-green-400',
  Lost: 'text-red-400',
};

export function StatsBar() {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadsApi.getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {Array.from({ length: 7 }).map((_, i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6 animate-fade-in">
      {/* Total */}
      <div className="card p-4 sm:col-span-1 col-span-2">
        <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">Total</p>
        <p className="text-2xl font-black">{stats.total}</p>
      </div>

      {/* By Status */}
      {(['New', 'Contacted', 'Qualified', 'Lost'] as const).map((s) => (
        <div key={s} className="card p-4">
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">{s}</p>
          <p className={`text-2xl font-black ${statusColors[s]}`}>{stats.byStatus[s] ?? 0}</p>
        </div>
      ))}

      {/* By Source */}
      {(['Website', 'Instagram', 'Referral'] as const).map((src) => (
        <div key={src} className="card p-4">
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider mb-1">{src}</p>
          <p className="text-2xl font-black text-purple-400">{stats.bySource[src] ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
