const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("category");
});

router.get("/:id", (req, res) => {
  res.render("single-product", { banner: "Shop Single" });
});

module.exports = router;
