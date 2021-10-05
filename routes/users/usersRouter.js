var express = require('express');
var router = express.Router();

const { createUser, login } = require("./controller/userController");
const { checkIsEmpty } = require("./lib/authMiddleware/authCreateMiddleware/checkIsEmpty");
const { checkIsUndefined } = require("./lib/authMiddleware/checkIsUndefined");
const { validateCreateData } = require("./lib/authMiddleware/authCreateMiddleware/validateCreateData");
const { validateLoginData } = require("./lib/authMiddleware/authLoginData/validateLoginDate");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post(
  "/create-user", 
  checkIsUndefined, 
  checkIsEmpty, 
  validateCreateData, 
  validateLoginData, 
  createUser
);

router.post(
  "/login", 
  checkIsUndefined, 
  checkIsEmpty, 
  validateLoginData, 
  login
);

module.exports = router;
