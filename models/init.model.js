// Models
const { User } = require("./user.model.js");
const { Product } = require("./product.model.js");
const { Cart } = require("./cart.model.js");
const { ProductInCart } = require("./productInCart.model.js");
const { Order } = require("./order.model.js");
const { ProductImg } = require("./productImg.model.js");
const { Category } = require("./categories.model.js");

const initModels = () => {
    // 1 User <----> M products
    User.hasMany(Product, { foreignKey: "userId" });
    Product.belongsTo(User);

    // 1 User <--> M Order
    User.hasMany(Order);
    Order.belongsTo(User);

    // 1 User <--> 1 Cart
    User.hasOne(Cart);
    Cart.belongsTo(User);

    // 1 Product <--> M ProductImg
    Product.hasMany(ProductImg, { foreignKey: "productId" });
    ProductImg.belongsTo(Product);

    // 1 Category <--> 1 Product
    Category.hasOne(Product);
    Product.belongsTo(Category);

    // 1 Cart <--> M ProductInCart
    Cart.hasMany(ProductInCart);
    ProductInCart.belongsTo(Cart);

    // 1 Product <--> 1 ProductInCart
    Product.hasOne(ProductInCart);
    ProductInCart.belongsTo(Product);

    // 1 Order <--> 1 Cart
    Cart.hasOne(Order);
    Order.belongsTo(Cart);
};

module.exports = { initModels };
