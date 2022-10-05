// Models
const { Product } = require("../models/product.model.js");

// Utils
const { catchAsync } = require("../utils/catchAsync.util.js");
const { AppError } = require("../utils/appError.util.js");

// Middlewares
const productExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findOne({
        // attributes: { exclude: ["password"] },
        where: { id, status: "active" },
    });
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    req.product = product;

    next();
});

const protectProductOwner = catchAsync(async (req, res, next) => {
    // Get current session user and the user that is going to be updated
    const { sessionUser, product } = req;

    // Compare the id's
    if (sessionUser.id !== product.id) {
        // If the ids aren't equal, return error
        return next(new AppError("You do not own this product", 403));
    }
    next();
});

module.exports = { productExists, protectProductOwner };
