const express = require("express");
const router = express.Router();
const UsersController = require("../layered/controllers/users");
const usersController = new UsersController();

router.post("/signup", usersController.Signup);
router.post("/login", usersController.Login);
module.exports = router;
