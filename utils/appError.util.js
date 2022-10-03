class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        // "" + 100 --> "100" Para convertir numero a string
        this.status = `${statusCode}`.startsWith("4") ? "error" : "fail";
        // status = error 4xx --> cliente || fail 5xx --> server

        // Capture the error stack and add it to the AppError instance
        Error.captureStackTrace(this);
    }
}

module.exports = { AppError };
