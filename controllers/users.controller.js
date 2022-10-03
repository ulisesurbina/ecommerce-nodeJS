const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model.js");
const { Product } = require("../models/product.model.js");

// Utils
const { catchAsync } = require("../utils/catchAsync.util.js");
const { AppError } = require("../utils/appError.util.js");

dotenv.config({ path: "./config.env" });

const getProductsForUsers = catchAsync(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ["password"] },
        where: { status: "active" },
        include: [{ model: Product }],
    });
    res.status(200).json({
        status: "success",
        data: {
            users: users,
        },
    });
});

const createUser = catchAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    // if (role !== "admin" && role !== "normal") {
    //     return next(new AppError("Invalid role", 400));
    // }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    newUser.password = undefined;

    res.status(201).json({
        status: "success",
        data: { newUser },
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { username, email } = req.body;

    const { user } = req;

    await user.update({ username, email });

    res.status(200).json({
        status: "success",
        data: { user },
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    await user.update({ status: "deleted" });

    res.status(200).json({ status: "success" });
});

const allOrderByUser = async (req, res) => {
    const { id } = req.session;
    const orders = await Order.findOne({
        where: { userId: id, status: "active" },
        include: [{ model: Meal, include: { model: Restaurant } }],
    });

    res.status(200).json({
        status: "success",
        data: {
            orders,
        },
    });
};

const ordersById = async (req, res) => {
    const { id } = req.params;
    const meals = await Meal.findOne({
        where: { id, status: "active" },
        include: [{ model: Restaurant }],
    });

    res.status(200).json({
        status: "success",
        data: {
            meals,
        },
    });
};

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email, status: "active" },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError("Wrong credentials", 400));
    }

    // Remove password from response
    user.password = undefined;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.status(200).json({
        status: "success",
        data: { user, token },
    });
});

module.exports = {
    getProductsForUsers,
    createUser,
    updateUser,
    deleteUser,
    allOrderByUser,
    ordersById,
    login,
};
