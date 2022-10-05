const jwt = require("jsonwebtoken");

const { User } = require("../models/user.model.js");

// Utils
const { catchAsync } = require("../utils/catchAsync.util.js");
const { AppError } = require("../utils/appError.util.js");

const protectSession = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new AppError("Invalid session", 403));
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify token owner
    const user = await User.findOne({
        where: { id: decoded.id, status: "active" },
    });
    if (!user) {
        return next(
            new AppError("The owner of the session is no a longer active", 403)
        );
    }
    // Grant access
    req.sessionUser = user;
    next();
});

// Check the sessionUser to compare to the one that wants to be updated/deleted
const protectUsersAccount = catchAsync(async (req, res, next) => {
    const { sessionUser, user } = req;

    if (sessionUser.id !== user.id) {
        return next(
            new AppError("You are not the owner of this account.", 403)
        );
    }
    next();
});

const protectAdmin = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    if (sessionUser.role !== "admin") {
        return next(
            new AppError("You do not have the access level for this data.", 403)
        );
    }
    next();
});

module.exports = {
    protectSession,
    protectUsersAccount,
    protectAdmin,
};
