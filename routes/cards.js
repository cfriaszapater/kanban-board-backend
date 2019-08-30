var express = require("express");
var router = express.Router();

var cardController = require("../controllers/cardController");

router.get("/", cardController.cardsList);

module.exports = router;
