import { LeadStatus, LeadSource } from '../types';

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  New: { label: 'New', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  Contacted: { label: 'Contacted', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  Qualified: { label: 'Qualified', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  Lost: { label: 'Lost', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const sourceConfig: Record<LeadSource, { label: string; className: string; icon: string }> = {
  Website: { label: 'Website', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: '🌐' },
  Instagram: { label: 'Instagram', className: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: '📸' },
  Referral: { label: 'Referral', className: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: '🤝' },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {config.label}
    </span>
  );
}

export function SourceBadge({ source }: { source: LeadSource }) {
  const config = sourceConfig[source];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
