const express = require("express");
const router = express.Router();
const usersRouter = require("./users");
const auth = require("../middlewares/auth");
router.use("/users", usersRouter);

router.get("/main", (req, res) => {
  res.render("main");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

module.exports = router;
