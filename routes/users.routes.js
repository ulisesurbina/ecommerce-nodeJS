const express = require("express");

// Controllers
const {
    getAllUsers,
    getUserProducts,
    createUser,
    updateUser,
    deleteUser,
    getUserOrders,
    getUserOrderById,
    login,
    // checkToken,
} = require("../controllers/users.controller.js");

// Middlewares
const {
    userExists,
    protectAccountOwner,
} = require("../middlewares/users.middlewares.js");
const {
    createUserValidators,
} = require("../middlewares/validators.middlewares.js");
const {
    protectSession,
    protectUsersAccount,
} = require("../middlewares/auth.middlewares.js");

const usersRouter = express.Router();

usersRouter.post("/", createUserValidators, createUser);

usersRouter.post("/login", login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get("/", userExists, getAllUsers);

usersRouter.get("/me", userExists, getUserProducts);

usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

usersRouter.get("/orders", userExists, getUserOrders);

usersRouter.get("/orders/:id", userExists, getUserOrderById);

module.exports = { usersRouter };
