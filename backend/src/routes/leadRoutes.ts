import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import { protect, authorizeRoles } from '../middleware/auth';
import {
  createLeadValidator,
  updateLeadValidator,
  leadQueryValidator,
} from '../middleware/validators';
import { UserRole } from '../types';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/stats', getLeadStats);
router.get('/export', exportLeadsCSV);

router
  .route('/')
  .get(leadQueryValidator, getLeads)
  .post(createLeadValidator, createLead);

router
  .route('/:id')
  .get(getLeadById)
  .put(updateLeadValidator, updateLead)
  .delete(authorizeRoles(UserRole.ADMIN, UserRole.SALES), deleteLead);

export default router;
