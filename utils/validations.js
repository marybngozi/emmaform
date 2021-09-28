const { check } = require("express-validator");

const login = [
  check("username", "Username is required").notEmpty(),
  check("password", "Password is required").notEmpty(),
];

module.exports = {
  login,
};
