"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const socketSetup_1 = __importDefault(require("./socket/socketSetup"));
dotenv_1.default.config({ path: './.env' });
const port = process.env.PORT || 8000;
const DB = process.env.MONGODB_URL.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);
mongoose_1.default.connect(DB).then(() => {
    console.log('Connection Successful');
});
const server = index_1.default.listen(port, () => {
    console.log(`app runnning on port ${port}`);
});
(0, socketSetup_1.default)(server);
