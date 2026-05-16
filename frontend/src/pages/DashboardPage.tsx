import { useState } from 'react';
import { Lead } from '../types';
import { useLeads } from '../hooks/useLeads';
import { leadsApi } from '../api/leads';
import { FiltersBar } from '../components/FiltersBar';
import { LeadRow } from '../components/LeadRow';
import { LeadModal } from '../components/LeadModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Pagination } from '../components/Pagination';
import { TableSkeleton } from '../components/Skeleton';
import { StatsBar } from '../components/StatsBar';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { leads, pagination, loading, filters, updateFilter, refresh } = useLeads();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setModalOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setDeletingLead(lead);
  };

  const confirmDelete = async () => {
    if (!deletingLead) return;
    setDeleteLoading(true);
    try {
      await leadsApi.deleteLead(deletingLead._id);
      toast.success('Lead deleted');
      setDeletingLead(null);
      refresh();
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setDeleteLoading(false);
    }
  };

  const openCreate = () => {
    setEditingLead(null);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Stats */}
      <StatsBar />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-black">Leads</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage your pipeline</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <span className="text-lg leading-none">+</span> New Lead
        </button>
      </div>

      {/* Filters */}
      <FiltersBar filters={filters} onChange={updateFilter} />

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : leads.length === 0 ? (
        <div className="card p-16 text-center animate-fade-in">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-lg mb-1">No leads found</p>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            {filters.search || filters.status || filters.source
              ? 'Try adjusting your filters'
              : 'Create your first lead to get started'}
          </p>
          {!filters.search && !filters.status && !filters.source && (
            <button onClick={openCreate} className="btn-primary mx-auto">
              + Create Lead
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Column headers */}
          <div className="flex items-center gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <div className="w-9 flex-shrink-0" />
            <div className="flex-1">Lead</div>
            <div className="hidden sm:block w-24 flex-shrink-0">Status</div>
            <div className="hidden md:block w-24 flex-shrink-0">Source</div>
            <div className="hidden lg:block w-24 flex-shrink-0">Created By</div>
            <div className="hidden lg:block w-24 flex-shrink-0">Date</div>
            <div className="w-16 flex-shrink-0" />
          </div>

          {leads.map((lead) => (
            <LeadRow
              key={lead._id}
              lead={lead}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <Pagination
          pagination={pagination}
          onPageChange={(page) => updateFilter({ page })}
        />
      )}

      {/* Lead Modal */}
      {modalOpen && (
        <LeadModal
          lead={editingLead}
          onClose={() => setModalOpen(false)}
          onSuccess={refresh}
        />
      )}

      {/* Delete Confirm */}
      {deletingLead && (
        <ConfirmDialog
          title="Delete Lead"
          message={`Are you sure you want to delete "${deletingLead.name}"? This cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={() => void confirmDelete()}
          onCancel={() => setDeletingLead(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
