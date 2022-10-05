// Models
const { Cart } = require("../models/cart.model.js");
const { Product } = require("../models/product.model.js");
const { ProductInCart } = require("../models/productInCart.model.js");

// Utils
const { catchAsync } = require("../utils/catchAsync.util.js");
const { AppError } = require("../utils/appError.util.js");

const getUserCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" },
        include: [
            {
                model: ProductInCart,
                required: false,
                where: { status: "active" },
                include: { model: Product },
            },
        ],
    });

    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    res.status(200).json({ status: "success", cart });
});

const addProductToCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId, quantity } = req.body;

    // Validate input quantity
    const product = await Product.findOne({
        where: { id: productId, status: "active" },
    });

    if (!product) {
        return next(new AppError("Product does not exists", 404));
    } else if (quantity > product.quantity) {
        return next(
            new AppError(
                `This product only has ${product.quantity} items available`,
                400
            )
        );
    }

    // Check if cart exists
    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" },
    });

    if (!cart) {
        // Create new cart for user
        const newCart = await Cart.create({ userId: sessionUser.id });

        // Add product to newly created cart
        await ProductInCart.create({
            cartId: newCart.id,
            productId,
            quantity,
        });
    } else {
        // Cart already exists
        const productInCart = await ProductInCart.findOne({
            where: { cartId: cart.id, productId },
        });

        if (!productInCart) {
            await ProductInCart.create({
                cartId: cart.id,
                productId,
                quantity,
            });
        } else if (productInCart.status === "active") {
            return next(
                new AppError("This product is already active in your cart", 400)
            );
        } else if (productInCart.status === "removed") {
            await productInCart.update({ status: "active", quantity });
        }
    }

    res.status(200).json({ status: "success" });
});

const updateProductInCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId, newQty } = req.body;

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" },
    });

    if (!cart) {
        return next(new AppError("You do not have a cart active.", 400));
    }

    // Validate that requested qty doesnt exceed the available qty
    const product = await Product.findOne({
        where: { id: productId, status: "active" },
    });

    if (!product) {
        return next(new AppError("Product does not exists", 404));
    } else if (newQty > product.quantity) {
        return next(
            new AppError(
                `This product only has ${product.quantity} items.`,
                400
            )
        );
    } else if (0 > newQty) {
        return next(new AppError("Cannot send negative values", 400));
    }

    const productInCart = await ProductInCart.findOne({
        where: { cartId: cart.id, productId, status: "active" },
    });

    if (!productInCart) {
        return next(new AppError("This product is not in your cart", 404));
    }

    if (newQty === 0) {
        // Remove product from cart
        await productInCart.update({ quantity: 0, status: "removed" });
    } else if (newQty > 0) {
        await productInCart.update({ quantity: newQty });
    }

    res.status(200).json({
        status: "success",
    });
});

const purchaseCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" },
        include: [
            {
                model: ProductInCart,
                required: false,
                where: { status: "active" },
                include: { model: Product },
            },
        ],
    });

    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    let totalPrice = 0;

    const productsPurchasedPromises = cart.productInCarts.map(
        async (productInCart) => {
            const newQty =
                productInCart.product.quantity - productInCart.quantity;

            const productPrice =
                productInCart.quantity * +productInCart.product.price;

            totalPrice += productPrice;

            await productInCart.product.update({ quantity: newQty });

            return await productInCart.update({ status: "purchased" });
        }
    );

    await Promise.all(productsPurchasedPromises);

    res.status(200).json({ status: "success" });
});

const removeProductFromCart = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { productId } = req.params;

    const cart = await Cart.findOne({
        where: { userId: sessionUser.id, status: "active" },
    });

    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    const productInCart = await ProductInCart.findOne({
        cartId: cart.id,
        productId,
        status: "active",
    });

    if (!productInCart) {
        return next(new AppError("Product not found in cart", 404));
    }

    await productInCart.update({ status: "removed", quantity: 0 });

    res.status(200).json({ status: "success" });
});

module.exports = {
    getUserCart,
    addProductToCart,
    updateProductInCart,
    purchaseCart,
    removeProductFromCart,
};
