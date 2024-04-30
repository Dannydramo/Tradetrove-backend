"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', productController_1.getAllProducts);
router.get('/:productId', productController_1.getProductById);
router.post('/create', authMiddleware_1.vendorProtect, productController_1.createProduct);
router.patch('/edit/:productId', authMiddleware_1.vendorProtect, productController_1.editProduct);
router.delete('/delete/:productId', authMiddleware_1.vendorProtect, productController_1.deleteProduct);
exports.default = router;
