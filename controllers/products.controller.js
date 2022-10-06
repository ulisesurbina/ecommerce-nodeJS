// const { ref, getDownloadURL } = require("firebase/storage");

const { Product } = require("../models/product.model.js");
const { Category } = require("../models/categories.model.js");
const { User } = require("../models/user.model.js");
const { ProductImg } = require("../models/productImg.model.js");

//Utils
const { storage } = require("../utils/firebase.util.js");
const { catchAsync } = require("../utils/catchAsync.util.js");
const { uploadProductImgs, getProductsImgsUrls } = require("../utils/firebase.util.js");

const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({
        where: { status: "active" },
        include: [
            { model: Category, attributes: ["name"] },
            { model: User, attributes: ["username", "email"] },
            { model: ProductImg },
        ],
    });
    const productWithImgs = await getProductsImgsUrls(products);
    res.status(201).json({ status: "success", products: productWithImgs });
});

const getProductById = catchAsync(async (req, res, next) => {

    res.status(200).json({ status: "success" });
});

const createProduct = catchAsync(async (req, res) => {
    const { sessionUser } = req;
    const { title, description, price, categoryId, quantity } = req.body;
    const newProduct = await Product.create({
        title,
        description,
        price,
        categoryId,
        quantity,
        userId: sessionUser.id,
    });
    await uploadProductImgs(req.files, newProduct.id);

    res.status(201).json({
        status: "success",
        data: {
            newProduct,
        },
    });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const { product } = req;
    const { title, description, quantity, price } = req.body;

    await product.update({ title, description, quantity, price });

    res.status(200).json({
        status: "success",
        data: {
            product,
        },
    });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    const { product } = req;

    await product.update({ status: "deleted" });

    res.status(200).json({ status: "success" });
});

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
