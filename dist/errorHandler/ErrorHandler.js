"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const ErrorHandler = (err, req, res, next) => {
    const defaultError = {
        statusCode: err.status || 500,
        message: err.message || "Something went wrong...",
    };
    return res
        .status(defaultError.statusCode)
        .json({ msg: defaultError.message });
};
exports.ErrorHandler = ErrorHandler;
