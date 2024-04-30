"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/all', authMiddleware_1.vendorProtect, orderController_1.getAllOrders);
router.get('/', authMiddleware_1.userProtect, orderController_1.getUserOrders);
exports.default = router;
