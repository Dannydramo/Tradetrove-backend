import express from 'express';
import { getAllOrders, getUserOrders } from '../controllers/orderController';
import { vendorProtect, userProtect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/all', vendorProtect, getAllOrders);
router.get('/', userProtect, getUserOrders);
export default router;
