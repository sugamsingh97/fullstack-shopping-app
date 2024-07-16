import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/product.controller.js';

const router = express.Router();

router.post('/addProduct', protectRoute, addProduct);
router.get('/getAllProducts', getAllProducts);
router.get('/getProductById/:id', getProductById);
router.put('/updateProduct/:id', protectRoute, updateProduct);

export default router;
