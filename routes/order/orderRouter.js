var express = require('express');
var router = express.Router();

const { jwtMiddleware } = require("../users/lib/authMiddleware");
const { isAlpha, isInt } = require("validator");
const Order = require('./model/Order');
const errorHandler = require("../utils/errorHandler/errorHandler");
const User = require('../users/model/User');

//GET home page. * /
router.get('/', function (req, res, next) {
    res.json({ message: 'order' });
});

router.get('/all-orders', async function (req, res, next) {

    try {
        
        let foundOrders = await Order.find();

        res.json({ message: "success", foundOrders })
    
    } catch (e) {

        res.status(500).json(errorHandler(e));

    }
})

router.post("/create-order", jwtMiddleware, async function (req, res) {
    
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
        
    } catch(e) {

        res.status(500).json(errorHandler(e));

    }

});

router.put("/update-order", jwtMiddleware, async function (req, res) {

    try {

        let errObj = {};
        const { id, orderName, orderAmount, orderItem } = req.body;

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

        let updatedOrder = await Order.findOneAndUpdate( id, req.body, { new: true});

        res.json({ message: "success", payload: updatedOrder });

    } catch {

        res.status(500).json(errorHandler(e));

    }

})

router.delete("/delete-order", jwtMiddleware, async function (req, res) {

    try {

        const { orderId } = req.body;

        let errObj = {};

        console.log(Order.find({ orderId: orderId }));

        if (!Order.findOne({ orderId: orderId })) {

            errObj.orderId = "Id not found";

        }

        if (Object.keys(errObj).length > 0) {

             return res.status(500).json({
                 message: "error",
                 error: errObj,

             });
        }

        
        let foundUser = await User.findOne({ orderHistory: orderId });
        const index = foundUser.orderHistory.indexOf(orderId)
        await foundUser.orderHistory.splice(index, 1);
        await Order.findByIdAndDelete(orderId);

        res.json({ message: "success", foundUser })

    } catch (e) {

        res.status(500).json(errorHandler(e));

    }

});

module.exports = router;