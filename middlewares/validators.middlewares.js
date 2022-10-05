const { body, validationResult } = require("express-validator");

const { AppError } = require("../utils/appError.util.js");

const checkValidations = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => {
            return error.msg;
        });
        const message = errorMessages.join(". ");

        return next(new AppError(message, 400));
    }
    next();
};

const createUserValidators = [
    body("username")
        .isString()
        .withMessage("Username must be a string")
        .notEmpty()
        .withMessage("Username cannot be emply")
        .isLength({ min: 3, max: 30 })
        .withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Must provide a valid email"),
    body("password")
        .isString()
        .withMessage("Password must be a string")
        .notEmpty()
        .withMessage("Password cannot be emply")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    checkValidations,
];

const createProductValidators = [
    body("title")
        .isString()
        .withMessage("Title must be a string")
        .notEmpty()
        .withMessage("Title cannot be emply")
        .isLength({ min: 2, max: 30 })
        .withMessage("Title must be at least 3 characters"),
    body("description")
        .isString()
        .withMessage("Description must be a string")
        .notEmpty()
        .withMessage("Description cannot be emply"),
    body("price")
        .isFloat({ min: 0 })
        // .custom(val => {
        //   return val > 0;
        // })
        .withMessage("Price must be greater than 0"),
    body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be greater than 0"),
    body("categoryId")
        .isInt({ min: 1 })
        .withMessage("Must provide a valid category"),
    checkValidations,
];

module.exports = {
    checkValidations,
    createUserValidators,
    createProductValidators,
};
