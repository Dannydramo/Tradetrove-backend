"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationByUser = exports.startConversation = void 0;
const conversationModel_1 = __importDefault(require("./../models/conversationModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const responseHelper_1 = require("../helpers/responseHelper");
exports.startConversation = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingConversation = yield conversationModel_1.default.findOne({
        members: {
            $all: [req.body.userId, req.body.vendorId],
        },
    });
    if (existingConversation) {
        return (0, responseHelper_1.ApiResponse)(201, res, 'Conversation already exist', 'success', { savedConversation: 'Conversation already exist' });
    }
    const newConversation = new conversationModel_1.default({
        members: [req.body.userId, req.body.vendorId],
    });
    const savedConversation = yield newConversation.save();
    return (0, responseHelper_1.ApiResponse)(201, res, 'Conversation created', 'success', savedConversation);
}));
exports.conversationByUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield conversationModel_1.default.find({
        members: { $in: [req.params.id] },
    });
    res.status(200).json({ conversation });
}));
