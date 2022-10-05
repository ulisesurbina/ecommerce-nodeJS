// Models
const { User } = require("../models/user.model.js");

// Utils
const { catchAsync } = require("../utils/catchAsync.util.js");
const { AppError } = require("../utils/appError.util.js");

// Middlewares
const userExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findOne({
        where: { id, status: "active" },
        attributes: { exclude: ["password"] },
    });
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    req.user = user;

    next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
    // Get current session user and the user that is going to be updated
    const { sessionUser, user } = req;

    // Compare the id's
    if (sessionUser.id !== user.id) {
        // If the ids aren't equal, return error
        return next(new AppError("You do not own this account", 403));
    }
    next();
});

module.exports = { userExists, protectAccountOwner };
