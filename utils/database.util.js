const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

// Establish db connection
const db = new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST, //127.0.0.1 es el IP del localhost
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB,
    logging: false, // Sequelize ya no imprimira mensajes extras de sequelize
});

module.exports = { db, DataTypes };
