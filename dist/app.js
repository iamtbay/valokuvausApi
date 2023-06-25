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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoute_1 = require("./routes/userRoute");
const connectDb_1 = require("./db/connectDb");
const ErrorHandler_1 = require("./errorHandler/ErrorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const imagesRoute_1 = require("./routes/imagesRoute");
const commentsRouter_1 = require("./routes/commentsRouter");
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const likesRouter_1 = require("./routes/likesRouter");
const path_1 = __importDefault(require("path"));
//VARIABLES
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT;
//MIDDLEWARES
app.use("/svimg", express_1.default.static(path_1.default.join(__dirname, "./public")));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:5173" }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)());
//ROUTES
app.use("/user", userRoute_1.userRouter);
app.use("/api/v1/explore", imagesRoute_1.imageRouter);
app.use("/api/v1/comments", commentsRouter_1.commentsRouter);
app.use("/api/v1/likes", likesRouter_1.likeRouter);
//
//error handler
app.use(ErrorHandler_1.ErrorHandler);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDb_1.connectDB)(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log(`app started on port ${port}`);
        });
    }
    catch (error) {
        console.log("error");
    }
});
start();
