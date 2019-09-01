var express = require("express");
var router = express.Router();

var cardController = require("../controllers/cardController");

router.get("/", cardController.list);
router.post("/", cardController.post);
router.get("/:cardId", cardController.get);
router.put("/:cardId", cardController.put);
router.delete("/:cardId", cardController.delete);

module.exports = router;
