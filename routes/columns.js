var express = require("express");
var router = express.Router();

var columnController = require("../controllers/columnController");

router.get("/", columnController.listColumns);
router.post("/", columnController.createColumn);
router.get("/:columnId", columnController.getColumn);
router.put("/:columnId", columnController.updateColumn);
router.delete("/:columnId", columnController.deleteColumn);

module.exports = router;
