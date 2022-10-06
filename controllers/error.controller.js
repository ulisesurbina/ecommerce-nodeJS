const dotenv = require("dotenv");
const { AppError } = require("../utils/appError.util.js");

dotenv.config({ path: "./config.env" });

const sendErrorDev = (error, req, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        error: error,
        stack: error.stack,
    });
};

const sendErrorProd = (error, req, res) => {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        status: "fail",
        message: error.message || "Something went wrong!",
    });
};

const tokenExpiredError = () => {
    return new AppError("Session expired", 401);
};

const tokenInvalidSignatureError = () => {
    return new AppError("Session invalid", 401);
};

const dbUniqueConstraintError = () => {
    return new AppError("The entered email has already been taken", 400);
};

const imgLimitError = () => {
    return new AppError("You can only upload 5 images", 400);
};

const globalErrorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "fail";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(error, req, res);
    } else if (process.env.NODE_ENV === "production") {
        let err = { ...error };

        if (error.name === "TokenExpiredError") err = tokenExpiredError();
        else if (error.name === "JsonWebTokenError")
            err = tokenInvalidSignatureError();
        else if (error.name === "SequelizeUniqueConstraintError")
            err = dbUniqueConstraintError();
        else if (error.code === "LIMIT_UNEXPECTED_FILE") err = imgLimitError();

        sendErrorProd(err, req, res);
    }
};

module.exports = { globalErrorHandler };
