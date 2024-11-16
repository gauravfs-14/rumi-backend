import express from 'express';
import { signup, login, logout, status } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/status", status);

export default router;
