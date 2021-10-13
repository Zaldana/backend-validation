const { isAlpha, isInt } = require("validator");
const Order = require('../model/Order');
const errorHandler = require("../../utils/errorHandler/errorHandler");
const User = require('../../users/model/User');


async function getAllOrders(req, res, next) {

    let foundAllOrders = await Order.find({});
    res.json({ message: "success", foundAllOrders })

};

async function createOrder(req, res) {

    try {

        const { orderName, orderAmount, orderItem } = req.body;

        let errObj = {};

        if (!isAlpha(orderName)) {

            errObj.orderName = "Alphabet Only"

        }

        if (!isInt(orderAmount)) {

            errObj.orderAmount = "Only Numbers!";

        }

        if (Object.keys(errObj).length > 0) {

            return res.status(500).json({
                message: "error",
                error: errObj,

            });
        }

        const decodedData = res.locals.decodedData
        let foundUser = await User.findOne({ email: decodedData.email })
        const createdOrder = new Order({
            orderName,
            orderAmount,
            orderItem,
            orderOwner: foundUser._id
        })

        let savedOrder = await createdOrder.save();

        foundUser.orderHistory.push(savedOrder._id);

        await foundUser.save();

        res.json({ message: "success", createdOrder })

    } catch (e) {

        res.status(500).json(errorHandler(e));

    }

};

async function deleteOrder(req, res) {

    try {

        let deletedOrder = await Order.findByIdAndRemove(req.params.id);

        if (!deletedOrder) {

            return res.status(404).json({ message: "failure", error: "record not found" })

        } else {

            const decodedData = res.locals.decodedData;

            let foundUser = await User.findOne({ email: decodedData.email });

            let userOrderHistoryArray = foundUser.orderHistory;

            let filteredOrderHistoryArray = userOrderHistoryArray.filter(
                (item) => item._id.toString() !== req.params.id);

            foundUser.orderHistory = filteredOrderHistoryArray;

            await foundUser.save();

            res.json({ message: "success", deletedOrder })

        }

    } catch (e) {

        res.status(500).json(errorHandler(e));

    }

};

async function updateOrder(req, res) {

    try {

        let foundOrder = await Order.findById(req.params.id);

        if (!foundOrder) {

            res.status(404).json({ message: "failure", error: "Order not found" });

        } else {

            let updatedOrder = await Order.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true
                }
            );

            res.json({ message: "success", payload: updatedOrder })

        }

    } catch (e) {

        res.status(500).json(errorHandler(e));
    }

};

module.exports = {
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder,
}

// router.get('/all-orders', async function (req, res, next) {

//     try {

//         let foundOrders = await Order.find();

//         res.json({ message: "success", foundOrders })

//     } catch (e) {

//         res.status(500).json(errorHandler(e));

//     }
// })

// router.delete("/delete-order", jwtMiddleware, async function (req, res) {

//     try {

//         const { orderId } = req.body;

//         let errObj = {};

//         console.log(Order.findOne({ orderId: orderId }));

//         if (!Order.findOne({ orderId: orderId })) {

//             errObj.orderId = "Id not found";

//         }

//         if (Object.keys(errObj).length > 0) {

//              return res.status(500).json({
//                  message: "error",
//                  error: errObj,

//              });
//         }


//         let foundUser = await User.findOne({ orderHistory: orderId });
//         const index = foundUser.orderHistory.indexOf(orderId)
//         await foundUser.orderHistory.splice(index, 1);
//         await Order.findByIdAndDelete(orderId);

//         res.json({ message: "success", foundUser })

//     } catch (e) {

//         res.status(500).json(errorHandler(e));

//     }

// });

// router.put("/update-order", jwtMiddleware, async function (req, res) {

//     try {

//         let errObj = {};
//         const { id, orderName, orderAmount, orderItem } = req.body;

//         if (!isAlpha(orderName)) {

//             errObj.orderName = "Alphabet Only"

//         }

//         if (!isInt(orderAmount)) {

//             errObj.orderAmount = "Only Numbers!";

//         }

//         if (Object.keys(errObj).length > 0) {

//             return res.status(500).json({
//                 message: "error",
//                 error: errObj,

//             });
//         }

//         let updatedOrder = await Order.findOneAndUpdate(id, req.body, { new: true });

//         res.json({ message: "success", payload: updatedOrder });

//     } catch {

//         res.status(500).json(errorHandler(e));

//     }

// })