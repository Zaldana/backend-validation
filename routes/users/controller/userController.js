const User = require("../model/User");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const errorHandler = require('../../utils/errorHandler/errorHandler')

async function createUser(req, res) {

    const { firstName, lastName, username, email, password } = req.body;

    try {

        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt);

        const createdUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashed,
        });

        let savedUser = await createdUser.save();

        res.json({ message: "success", payload: savedUser });
    
    } catch (error) {
     
        res.status(500).json({ message: "error", error: errorHandler(error) });
    
    }
}

async function login(req, res) {

    const { email, password } = req.body;

    let foundUser = await User.findOne({ email: email });
    
   try {

       if (!foundUser) {

           res.status(500).json({
               message: "error",
               error: "please create an account",
           });

       } else {

           let jwtToken = jwt.sign(

            {
                email: foundUser.email,
                username: foundUser.username,
            },

            process.env.JWT_SECRET,
            {expiresIn: "24h" }
           
            );

           res.json({ message: "success", payload: jwtToken })
           
        let matchedPassword = await bcrypt.compare(password, foundUser.password);

        if (!matchedPassword) {
           
            res.send("Please check email and password is correct")
       
        }
    }

    } catch (e) {
        
        res.status(500).json({
            message: "error",
            error: e.message,
        });
    }
}

async function updateUser(req, res) {

    const { password } = req.body;

    try {

        const decodedData = res.locals.decodedData;
        let salt = await bcrypt.genSalt(10);
        let hashed = await bcrypt.hash(password, salt);

        req.body.password = hashed;

        let updatedUser = await User.findOneAndUpdate(
            { email: decodedData.email },
            req.body,
            { new: true }
        );

        res.json({ message: "success", payload: updatedUser });

    } catch (error) {

        res.status(500).json({ message: "error", error: error.message });

    }
}

async function getUserInfo(req, res) {

    try {

        const decodedData = res.locals.decodedData;
        const foundUser = await User.findOne({ email: decodedData.email }).populate(
            "orderHistory", "-orderOwner -__v");

        res.json({ message: "success", payload: foundUser })

    } catch (e) {

        res.status(500).json({ message: "error", error: errorHandler(error) });

    }
};

module.exports = {
    createUser,
    login,
    updateUser,
    getUserInfo
}