var express = require("express");
var router = express.Router();

var columnController = require("../controllers/columnController");

router.get("/", columnController.list);
router.post("/", columnController.create);
router.get("/:columnId", columnController.get);
router.put("/:columnId", columnController.update);
router.delete("/:columnId", columnController.delete);

module.exports = router;
