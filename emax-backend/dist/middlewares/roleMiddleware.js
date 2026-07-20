"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Please log in.",
        });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You do not have permission to perform this action.",
        });
    }
    next();
};
exports.authorize = authorize;
