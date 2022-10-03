const { db, DataTypes } = require("../utils/database.util.js");

const ProductImg = db.define("productImg", {
    id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
    },
});

module.exports = { ProductImg };