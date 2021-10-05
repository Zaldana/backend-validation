const User = require("../model/User");
const bcrypt = require('bcryptjs');
const { isEmpty, isAlpha, isAlphanumeric, isEmail, isStrongPassword } = require('validator');

async function createUser(req, res) {

    const { firstName, lastName, username, email, password } = req.body;
    let body = req.body;
    let errObj = {};

    for (let key in body) {
        if (isEmpty(body[key])) {
            errObj[`${key}`] = `${key} cannot be empty`;
        }
    }

    if (!isAlpha(firstName)) {
        errObj.firstName = "First Name cannot have special characters or numbers";
    }

    if (!isAlpha(lastName)) {
        errObj.lastName = "Last Name cannot have special characters or numbers";
    }

    if (!isAlphanumeric(username)) {
        errObj.username = "Username cannot have special characters";
    }

    if (!isEmail(email)) {
        errObj.email = "please enter a valid email";
    }

    if (!isStrongPassword(password)) {
        errObj.password =
            "Your password must contain 1 lowercase, 1 uppercase, 1 number, 1 special character and at least 8 characters long";
    }

    if (Object.keys(errObj).length > 0) {
        //How would you validate firstName to make sure only alphabet is allowed
        return res.status(500).json({
            message: "error",
            error: errObj,
        });
    }

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
        res.status(500).json({ message: "error", error: error.message });
    }
}

async function login(req, res) {

    const { email, password } = req.body;
    let errObj = {};

    if (isEmpty(email)) {
        errObj.email = "email field cannot be empty"
    }

    if (isEmpty(password)) {
        errObj.password = "password cannot be empty"
    }

    if (!isEmail(email)) {
        errObj.email = "please enter valid email"
    }

    if (Object.keys(errObj).length > 0) {
        return res.status(500).json({
            message: "error",
            error: errObj,
        });
    }

    let foundUser = await User.findOne({ email: email });

    try {

        if (!foundUser) {

            res.status(500).json({
                message: "error",
                error: "please create an account",
            });

        } else {

            let matchedPassword = await bcrypt.compare(password, foundUser.password);

            if (!matchedPassword) {

                res.send("Please check email and password is correct")

            } else {

                res.json({
                    message: "success",

                });
            }

        }


    } catch (e) {

        res.status(500).json({
            message: "error",
            error: e.message,
        });
    }

}

module.exports = {
    createUser,
    login
}