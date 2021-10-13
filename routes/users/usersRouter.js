var express = require('express');
var router = express.Router();

const {
  createUser,
  login,
  updateUser,
  getUserInfo
} = require("./controller/userController");

const { 
  checkIsEmpty, 
  checkIsUndefined, 
  validateCreateData,
  validateLoginData,
  validateUpdateData,
  jwtMiddleware 
} = require("./lib/authMiddleware");

router.get('/',
  jwtMiddleware,
  getUserInfo
);

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
