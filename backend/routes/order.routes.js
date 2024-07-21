import express from 'express';
import {
  addToOrder,
  getAllOrders,
  getAllClientOrders,
  updateOrder,
  updateStatus,
  getCurrentOrder,
} from '../controllers/order.controller.js';
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router();

router.post('/addOrder', protectRoute, addToOrder);
router.get('/getCurrentOrder', protectRoute, getCurrentOrder);
router.get('/getAllOrders', protectRoute, getAllOrders);
router.get('/getAllClientOrders', protectRoute, getAllClientOrders);
router.put('/updateOrder', protectRoute, updateOrder);
router.put('/updateStatus', protectRoute, updateStatus);

export default router;
