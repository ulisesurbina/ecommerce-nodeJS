const { db, DataTypes } = require("../utils/database.util.js");

const Cart = db.define("cart", {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
    },
});

module.exports = { Cart };