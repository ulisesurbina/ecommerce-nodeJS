const { Product } = require("../models/product.model.js");

const { catchAsync } = require("../utils/catchAsync.util.js");

const createProduct = catchAsync(async (req, res) => {
    const { title, description, price, categoryId, quantity, userId } = req.body;
    // const { id } = req.params;
    const product = await Product.create({
        title,
        description,
        price,
        categoryId,
        quantity,
        userId,
    });
    if (!product) {
        return res.status(400).json({
            status: "error",
            message: "Product no create",
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            product,
        },
    });
});

// const allOrderByUser = async (req, res) => {
//     const { id } = req.session;
//     const orders = await Order.findOne({
//         where: { userId: id, status: "active" },
//         include: [{ model: Meal, include: { model: Restaurant } }],
//     });

//     res.status(200).json({
//         status: "success",
//         data: {
//             orders,
//         },
//     });
// };

// const updateOrder = async (req, res) => {
//     const { id } = req.params;

//     const order = await Order.findOne({ where: { id, status: "active" } });
//     if (!order) {
//         return res.status(400).json({
//             status: "error",
//             message: "order no found",
//         });
//     }
//     await order.update({ status: "completed" });
//     res.status(200).json({
//         status: "success",
//         data: {
//             order,
//         },
//     });
// };

// const deleteOrder = async (req, res) => {
//     const { id } = req.params;

//     const order = await Order.findOne({ where: { id, status: "active" } });
//     if (!order) {
//         return res.status(400).json({
//             status: "error",
//             message: "order no found",
//         });
//     }
//     await order.update({ status: "deleted" });
//     res.status(200).json({
//         status: "success",
//         data: {
//             order,
//         },
//     });
// };

module.exports = {
    createProduct,
    // allOrderByUser,
    // updateOrder,
    // deleteOrder,
};
