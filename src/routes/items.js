const express = require("express");
const router = express.Router();
const ItemsController = require("../layered/controllers/items");
const itemsController = new ItemsController();

router.post("/", itemsController.MakeItem);

module.exports = router;
