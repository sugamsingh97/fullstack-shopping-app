import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';

// intializing express router
const router = express.Router();

// defining routes for signup, login and logout
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;
