const express = require("express");
const { register, login, authToken } = require("../controllers/auth.js");
const { getUsers } = require("../controllers/users.js");

const router = express.Router();

// /users
router.get("/users", getUsers);

// /auth
router.post("/register", register);
router.post("/login", login);

module.exports = router;
