const { db, DataTypes } = require("../utils/database.util.js");

const Category = db.define("category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "active",
    },
});

module.exports = { Category };