const { db, DataTypes } = require("../utils/database.util.js");

const ProductImg = db.define("productImg", {
    id: {
        type: DataTypes.INTEGER,
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
        defaultValue: "active",
    },
});

module.exports = { ProductImg };