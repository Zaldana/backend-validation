var express = require('express');
var router = express.Router();

const {
  createUser,
  login,
  updateUser,
} = require("./controller/userController");

const { 
  checkIsEmpty, 
  checkIsUndefined, 
  validateCreateData,
  validateLoginData,
  validateUpdateData,
  jwtMiddleware 
} = require("./lib/authMiddleware");

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post(
  "/create-user", 
  checkIsUndefined, 
  checkIsEmpty, 
  validateCreateData, 
  createUser
);

router.post(
  "/login", 
  checkIsUndefined, 
  checkIsEmpty, 
  validateLoginData, 
  login
);

router.put(
  "/profile",
  jwtMiddleware,
  checkIsUndefined,
  checkIsEmpty,
  validateUpdateData,
  updateUser
);

module.exports = router;
