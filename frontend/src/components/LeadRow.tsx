import { Lead } from '../types';
import { StatusBadge, SourceBadge } from './Badges';

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function LeadRow({ lead, onEdit, onDelete }: LeadRowProps) {
  const createdByName =
    typeof lead.createdBy === 'object' ? lead.createdBy.name : 'Unknown';

  return (
    <div className="card p-4 flex items-center gap-4 hover:bg-[var(--bg-hover)] transition-colors group animate-fade-in">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        {getInitials(lead.name)}
      </div>

      {/* Name + Email */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{lead.name}</p>
        <p className="text-xs text-[var(--text-muted)] truncate font-mono">{lead.email}</p>
      </div>

      {/* Status */}
      <div className="hidden sm:block flex-shrink-0">
        <StatusBadge status={lead.status} />
      </div>

      {/* Source */}
      <div className="hidden md:block flex-shrink-0">
        <SourceBadge source={lead.source} />
      </div>

      {/* Created by */}
      <div className="hidden lg:block text-xs text-[var(--text-muted)] flex-shrink-0 w-24 truncate">
        {createdByName}
      </div>

      {/* Date */}
      <div className="hidden lg:block text-xs text-[var(--text-muted)] flex-shrink-0">
        {formatDate(lead.createdAt)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(lead)}
          className="p-1.5 rounded-lg hover:bg-sky-500/10 text-sky-400 transition-colors text-sm"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(lead)}
          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-sm"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
