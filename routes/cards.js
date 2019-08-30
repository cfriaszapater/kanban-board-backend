var express = require("express");
var router = express.Router();

var cardController = require("../controllers/cardController");

router.get("/", cardController.listCards);
router.post("/", cardController.createCard);
router.get("/:cardId", cardController.getCard);
router.put("/:cardId", cardController.updateCard);
router.delete("/:cardId", cardController.deleteCard);

module.exports = router;
