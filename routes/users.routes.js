const express = require("express");

// Controllers
const {
    getProductsForUsers,
    createUser,
    updateUser,
    deleteUser,
    allOrderByUser,
    ordersById,
    login,
} = require("../controllers/users.controller.js");

// Middlewares
const { userExists } = require("../middlewares/users.middlewares.js");
const {
    createUserValidators,
} = require("../middlewares/validators.middlewares.js");
const {
    protectSession,
    protectUsersAccount,
    protectAdmin,
} = require("../middlewares/auth.middlewares.js");

const usersRouter = express.Router();

usersRouter.post("/", createUserValidators, createUser);

usersRouter.post("/login", login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get("/me", getProductsForUsers);

usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

usersRouter.get("/orders", userExists, allOrderByUser);

usersRouter.get("/orders/:id", userExists, ordersById);

module.exports = { usersRouter };
