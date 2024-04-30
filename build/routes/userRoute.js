"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const productController_1 = require("../controllers/productController");
const vendorController_1 = require("../controllers/vendorController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/auth/register', userController_1.registerUser);
router.post('/auth/login', userController_1.loginUser);
router.get('/details', authMiddleware_1.userProtect, userController_1.getUserdetails);
router.get('/get-vendor-details', userController_1.vendorByBusinessName);
router.get('/vendor/products/:vendorId', productController_1.getProductsByVendor);
router.get('/vendor-cart-details/:vendorId', vendorController_1.getVendorDetails);
exports.default = router;
