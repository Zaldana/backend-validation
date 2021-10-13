var express = require('express');
var router = express.Router();

const { jwtMiddleware } = require("../users/lib/authMiddleware");


const {
    getAllOrders,
    createOrder,
    updateOrder,
    deleteOrder
} = require("./controller/orderController");

//GET home page. * /
router.get('/', jwtMiddleware, getAllOrders);

router.post("/create-order", jwtMiddleware, createOrder);

router.delete("/delete-order-by-id/:id", jwtMiddleware, deleteOrder);

router.put("/update-order-by-id/:id", jwtMiddleware, updateOrder);

module.exports = router;