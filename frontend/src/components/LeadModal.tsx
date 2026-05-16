import { useState, useEffect } from 'react';
import { Lead, LeadForm, LeadSource, LeadStatus } from '../types';
import { leadsApi } from '../api/leads';
import toast from 'react-hot-toast';

interface LeadModalProps {
  lead?: Lead | null;
  onClose: () => void;
  onSuccess: () => void;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const defaultForm: LeadForm = {
  name: '',
  email: '',
  status: 'New',
  source: 'Website',
  notes: '',
};

export function LeadModal({ lead, onClose, onSuccess }: LeadModalProps) {
  const [form, setForm] = useState<LeadForm>(defaultForm);
  const [errors, setErrors] = useState<Partial<LeadForm>>({});
  const [loading, setLoading] = useState(false);
  const isEditing = !!lead;

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes || '',
      });
    }
  }, [lead]);

  const validate = (): boolean => {
    const errs: Partial<LeadForm> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEditing && lead) {
        await leadsApi.updateLead(lead._id, form);
        toast.success('Lead updated!');
      } else {
        await leadsApi.createLead(form);
        toast.success('Lead created!');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold">{isEditing ? 'Edit Lead' : 'New Lead'}</h2>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg text-xl leading-none">×</button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="label">Full Name *</label>
            <input
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="rahul@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Status + Source */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <select
                className="input"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Source *</label>
              <select
                className="input"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}
              >
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input resize-none"
              rows={3}
              placeholder="Optional notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-ghost flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
