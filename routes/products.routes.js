const express = require("express");

// Controllers
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/products.controller.js");

const {
    getAllCategories,
    createCategory,
    updateCategory,
} = require("../controllers/categories.controller.js");

// Middlewares
const {
    productExists,
    protectProductOwner,
} = require("../middlewares/products.middlewares.js");
const {
    createProductValidators,
} = require("../middlewares/validators.middlewares.js");
const {
    protectSession,
    // protectAdmin,
} = require("../middlewares/auth.middlewares.js");

// Utils
const { upload } = require("../utils/multer.util");

const productsRouter = express.Router();

productsRouter.get("/", getAllProducts);

productsRouter.get("/:id", getProductById);

productsRouter.get("/categories", getAllCategories);

// Protecting below endpoints
productsRouter.use(protectSession);

productsRouter.post(
    "/",
    upload.array("productImgs", 5),
    createProductValidators,
    createProduct
);

productsRouter.patch("/:id", productExists, protectProductOwner, updateProduct);

productsRouter.delete(
    "/:id",
    productExists,
    protectProductOwner,
    deleteProduct
);

productsRouter.post("/categories", createCategory);

productsRouter.patch("/categories/:id", updateCategory);

module.exports = { productsRouter };
