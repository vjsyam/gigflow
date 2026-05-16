// ─── Enums ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type UserRole = 'admin' | 'sales';

// ─── Models ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: { _id: string; name: string; email: string } | string;
  assignedTo?: { _id: string; name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedLeads {
  data: Lead[];
  pagination: PaginationMeta;
  success: boolean;
}

export interface LeadStats {
  total: number;
  byStatus: Partial<Record<LeadStatus, number>>;
  bySource: Partial<Record<LeadSource, number>>;
}

// ─── Filter/Query Types ───────────────────────────────────────────────────────

export interface LeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sortBy?: 'latest' | 'oldest';
  page?: number;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  name: string;
  role: UserRole;
}

export interface LeadForm {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
}
