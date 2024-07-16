import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getAllUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/getAllUsers', protectRoute, getAllUsers);

export default router;
