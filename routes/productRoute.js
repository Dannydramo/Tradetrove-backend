const express = require('express');
const {
    createProduct,
    deleteProduct,
    editProduct,
    getAllProducts,
    getProductById,
    getTwoRandomProducts,
    getLatestProduct,
} = require('../controllers/productController');
const { vendorProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/latest', getLatestProduct);
router.get('/random-products', getTwoRandomProducts);
router.get('/:productId', getProductById);
router.post('/create', vendorProtect, createProduct);
router.patch('/edit/:productId', vendorProtect, editProduct);
router.delete('/delete/:productId', vendorProtect, deleteProduct);

module.exports = router;
