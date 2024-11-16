import express from 'express';
import { signup, setPreferences, getMatches } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/preferences', setPreferences);
router.get('/matches/:userId', getMatches);

export default router;
