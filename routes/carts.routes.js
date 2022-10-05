const express = require("express");

// Controllers
const {
    getUserCart,
    addProductToCart,
    updateProductInCart,
    purchaseCart,
    removeProductFromCart,
} = require("../controllers/orders.controller.js");

// Middlewares
const { protectSession } = require('../middlewares/auth.middlewares.js');

const cartsRouter = express.Router();

cartsRouter.use(protectSession);

cartsRouter.get('/', getUserCart);

cartsRouter.post('/add-product', addProductToCart);

cartsRouter.patch('/update-cart', updateProductInCart);

cartsRouter.delete('/:productId', removeProductFromCart);

cartsRouter.post('/purchase', purchaseCart);

module.exports = { cartsRouter };
