const User = require("../model/User");
const bcrypt = require('bcryptjs');

function checkForNumberAndSymbol(target) {
    if (target.match(/[!`\-=@#$%^&*()\[\],.?":;{}|<>1234567890]/g)) {
        return true;
    } else {
        return false;
    }
}

function checkForEmpty(target) {
    if (target.length === 0) {
        return true;
    } else {
        return false;
    }
}

function checkForSymbol(target) {
    if (target.match(/[!`\-=@#$%^&*()\[\],.?":;{}|<>}]/g)) {
        return true;
    } else {
        return false;
    }
}

function checkForEmail(target) {
    if (target.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)) {
        return false;
    } else {
        return true;
    }
}

function checkForPassword(target) {
    if (target.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
        return false;
    } else {
        return true;
    }
}

async function createUser(req, res) {

    const { firstName, lastName, username, email, password } = req.body;

    let body = req.body;
    let errObj = {};

    for (let key in body) {

        if (checkForEmpty(body[key])) {
            errObj[`${key}`] = `${key} cannot be empty`;
        }
    }

    if (checkForNumberAndSymbol(firstName)) {
        errObj.firstName = "First Name cannot have special characters or numbers";
    }

    // if (checkForEmpty(firstName)) {
    //     errObj.firstName = "First Name cannot be empty";
    // }


    if (checkForNumberAndSymbol(lastName)) {
        errObj.lastName = "Last Name cannot have special characters or numbers";
    }

    // if (checkForEmpty(lastName)) {
    //     errObj.lastName = "First Name cannot be empty";
    // }

    if (checkForSymbol(username)) {
        errObj.username = "Username cannot have special characters";
    }

    if (checkForEmail(email)) {
        errObj.email = "Incorrect email format";
    }

    if (checkForPassword(password)) {
        errObj.email = "Incorrect password format";
    }

    if (Object.keys(errObj).length > 0) {
        return res.status(500).json({
            message: "error",
            error: errObj,
        })
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

        res.status(500).json({ message: "error", error: error.message })

    }

}

module.exports = {
    createUser
}

