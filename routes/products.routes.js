const express = require("express");

// Controllers
const {
    createProduct,
} = require("../controllers/products.controller.js");

// Middlewares
const { productExists } = require("../middlewares/products.middlewares.js");
const {
    createProductValidators,
} = require("../middlewares/validators.middlewares.js");
// const {
//     protectSession,
//     protectUsersAccount,
//     protectAdmin,
// } = require("../middlewares/auth.middlewares.js");

const productsRouter = express.Router();

productsRouter.post("/", createProductValidators, createProduct);

// Protecting below endpoints
// productsRouter.use(protectSession);

// productsRouter.get("/me", getProductsForUsers);

// productsRouter.patch("/:id", productExists, protectUsersAccount, updateUser);

// productsRouter.delete("/:id", productExists, protectUsersAccount, deleteUser);

module.exports = { productsRouter };