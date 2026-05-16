import { body, query, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { LeadSource, LeadStatus } from '../types';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
    return;
  }
  next();
};

// ─── Auth Validators ──────────────────────────────────────────────────────────

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'sales']).withMessage('Invalid role'),
  handleValidationErrors,
];

export const loginValidator = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// ─── Lead Validators ──────────────────────────────────────────────────────────

export const createLeadValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage('Invalid status'),
  body('source')
    .notEmpty()
    .isIn(Object.values(LeadSource))
    .withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long'),
  handleValidationErrors,
];

export const updateLeadValidator = [
  param('id').isMongoId().withMessage('Invalid lead ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 100 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('status').optional().isIn(Object.values(LeadStatus)).withMessage('Invalid status'),
  body('source').optional().isIn(Object.values(LeadSource)).withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }),
  handleValidationErrors,
];

export const leadQueryValidator = [
  query('status').optional().isIn(Object.values(LeadStatus)),
  query('source').optional().isIn(Object.values(LeadSource)),
  query('sortBy').optional().isIn(['latest', 'oldest']),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  handleValidationErrors,
];
