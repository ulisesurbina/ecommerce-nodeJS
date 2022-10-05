const express = require("express");
const cors = require("cors");

// Routers
const { usersRouter } = require("./routes/users.routes.js");
const { productsRouter } = require("./routes/products.routes.js");
const { cartsRouter } = require('./routes/carts.routes.js');

// Controllers
const { globalErrorHandler } = require("./controllers/error.controller.js");

//Init our Express app
const app = express();

// Enable CORS
app.use(cors());

// Enable express app to receive JSON data
app.use(express.json());

//Define endpoints
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartsRouter);

//Global error handler
app.use(globalErrorHandler);

// Catch  non-existing endpoints
app.all("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: `${req.method} ${req.url} does not exists in our server`,
    });
});

module.exports = { app };
