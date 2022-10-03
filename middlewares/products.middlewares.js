// Models
const { Product } = require("../models/product.model.js");

// Utils
const { catchAsync } = require("../utils/catchAsync.util.js");
const { AppError } = require("../utils/appError.util.js");

// Middlewares
const productExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findOne({
        attributes: { exclude: ["password"] },
        where: { id } });
    if (!product) {
        return next(new AppError("Product not found", 404));
    }

    req.product = product;

    next();
});

module.exports = { productExists };