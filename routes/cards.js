var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
  res.json([
    {
      id: 1,
      content: "jarl"
    },
    {
      id: 2,
      content: "condemor"
    }
  ]);
});

module.exports = router;
