"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const reviewController_1 = require("../controllers/reviewController");
const router = express_1.default.Router();
router.post('/create', authMiddleware_1.userProtect, reviewController_1.createReview);
router.get('/get/:productId', reviewController_1.getReviewsByProduct);
exports.default = router;
