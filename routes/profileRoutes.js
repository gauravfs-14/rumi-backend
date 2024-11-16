import express from 'express';
import { getUserProfile, updateUserProfile, isProfileCompleted } from '../controllers/preferencesController.js';
import { updatePreferences } from '../controllers/preferencesController.js';
import { getMatches } from '../controllers/matchController.js';
import protect  from '../middleware/authMiddleware.js';
import { createUserProfile } from '../controllers/profileController.js';

const router = express.Router();

router.get('/:userId', protect, getUserProfile);
router.put('/:userId', protect, updateUserProfile);
router.put('/preferences/:userId', protect, updatePreferences);
router.get('/completed/:userId', protect, isProfileCompleted);
router.get('/matches/:userId', protect, getMatches);
router.post('/create', protect, createUserProfile);

export default router;
