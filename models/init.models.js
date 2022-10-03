// Models
const { User } = require("./user.model.js");
const { Product } = require("./product.model.js");

const initModels = () => {
    // 1 user <----> M products
    User.hasMany(Product, { foreignKey: "userId" });
    Product.belongsTo(User);
};

module.exports = { initModels };
