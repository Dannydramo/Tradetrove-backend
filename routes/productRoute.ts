import express from 'express';
import {
    createProduct,
    deleteProduct,
    editProduct,
    getAllProducts,
    getProductById,
} from '../controllers/productController';
import { vendorProtect } from '../middleware/vendorMiddleware';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:productId', getProductById);
router.post('/create', vendorProtect, createProduct);
router.patch('/edit/:productId', vendorProtect, editProduct);
router.delete('/delete/:productId', vendorProtect, deleteProduct);

export default router;
