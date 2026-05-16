import { Response, NextFunction } from 'express';
import { stringify } from 'csv-stringify';
import { Lead } from '../models/Lead';
import { AuthenticatedRequest, LeadQuery, LeadSource, LeadStatus, UserRole } from '../types';
import { createError } from '../middleware/errorHandler';
import { FilterQuery } from 'mongoose';
import { ILeadDocument } from '../types';

const LEADS_PER_PAGE = 10;

// ─── Helper: build filter query ───────────────────────────────────────────────

const buildFilter = (
  query: LeadQuery,
  userId: string,
  role: UserRole
): FilterQuery<ILeadDocument> => {
  const filter: FilterQuery<ILeadDocument> = {};

  // Sales users can only see their own leads
  if (role === UserRole.SALES) {
    filter.createdBy = userId;
  }

  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;

  if (query.search) {
    const regex = new RegExp(query.search, 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  return filter;
};

// ─── GET /leads ───────────────────────────────────────────────────────────────

export const getLeads = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search, sortBy, page = 1, limit = LEADS_PER_PAGE } =
      req.query as unknown as LeadQuery;

    const filter = buildFilter(
      { status, source, search },
      req.user!.id,
      req.user!.role
    );

    const sort: Record<string, 1 | -1> =
      sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const skip = (page - 1) * limit;
    const total = await Lead.countDocuments(filter);

    const leads = await Lead.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .lean();

    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + leads.length < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /leads/:id ───────────────────────────────────────────────────────────

export const getLeadById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) return next(createError('Lead not found', 404));

    // Sales user can only view their own leads
    if (
      req.user!.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      return next(createError('Not authorized to view this lead', 403));
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// ─── POST /leads ──────────────────────────────────────────────────────────────

export const createLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source, notes, assignedTo } = req.body as {
      name: string;
      email: string;
      status?: LeadStatus;
      source: LeadSource;
      notes?: string;
      assignedTo?: string;
    };

    const lead = await Lead.create({
      name,
      email,
      status: status || LeadStatus.NEW,
      source,
      notes,
      assignedTo,
      createdBy: req.user!.id,
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /leads/:id ───────────────────────────────────────────────────────────

export const updateLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) return next(createError('Lead not found', 404));

    // Sales user can only update their own leads
    if (
      req.user!.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      return next(createError('Not authorized to update this lead', 403));
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /leads/:id ────────────────────────────────────────────────────────

export const deleteLead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(createError('Lead not found', 404));

    // Only admins or the creator can delete
    if (
      req.user!.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      return next(createError('Not authorized to delete this lead', 403));
    }

    await lead.deleteOne();

    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── GET /leads/export ────────────────────────────────────────────────────────

export const exportLeadsCSV = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as unknown as LeadQuery;

    const filter = buildFilter(
      { status, source, search },
      req.user!.id,
      req.user!.role
    );

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name')
      .lean();

    const rows = leads.map((lead) => ({
      Name: lead.name,
      Email: lead.email,
      Status: lead.status,
      Source: lead.source,
      Notes: lead.notes || '',
      'Created By': (lead.createdBy as unknown as { name: string })?.name || '',
      'Created At': new Date(lead.createdAt!).toISOString(),
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');

    stringify(rows, { header: true }).pipe(res);
  } catch (error) {
    next(error);
  }
};

// ─── GET /leads/stats ─────────────────────────────────────────────────────────

export const getLeadStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const matchStage =
      req.user!.role === UserRole.SALES
        ? { $match: { createdBy: req.user!.id } }
        : { $match: {} };

    const [statusStats, sourceStats, totalCount] = await Promise.all([
      Lead.aggregate([matchStage, { $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([matchStage, { $group: { _id: '$source', count: { $sum: 1 } } }]),
      Lead.countDocuments(
        req.user!.role === UserRole.SALES ? { createdBy: req.user!.id } : {}
      ),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalCount,
        byStatus: Object.fromEntries(statusStats.map((s) => [s._id, s.count])),
        bySource: Object.fromEntries(sourceStats.map((s) => [s._id, s.count])),
      },
    });
  } catch (error) {
    next(error);
  }
};
