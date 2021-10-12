const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    
    {
        orderName: {

            type: String
        },

        orderItem: {
            type: Array
        },

        orderAmount: {
            type: Number
        },

        orderOwner: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("order", OrderSchema);