import { PaginationMeta } from '../types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <span className="text-sm text-[var(--text-muted)]">
        Showing <span className="text-[var(--text)] font-medium">{start}–{end}</span> of{' '}
        <span className="text-[var(--text)] font-medium">{total}</span> leads
      </span>

      <div className="flex items-center gap-1">
        <button
          className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-30"
          disabled={!pagination.hasPrev}
          onClick={() => onPageChange(page - 1)}
        >
          ← Prev
        </button>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
          if (p < 1 || p > totalPages) return null;
          return (
            <button
              key={p}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-sky-500 text-white'
                  : 'btn-ghost'
              }`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          );
        })}

        <button
          className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-30"
          disabled={!pagination.hasNext}
          onClick={() => onPageChange(page + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
