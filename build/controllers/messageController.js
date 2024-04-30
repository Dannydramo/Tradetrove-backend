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
exports.getConversationMessages = exports.sendMessage = void 0;
const messageModel_1 = __importDefault(require("./../models/messageModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.sendMessage = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = new messageModel_1.default(req.body);
    const savedMessage = yield newMessage.save();
    res.status(200).json({ savedMessage });
}));
exports.getConversationMessages = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield messageModel_1.default.find({
        conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
}));
