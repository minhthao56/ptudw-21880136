const express = require("express");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/", (req, res, next) => {
  categoryController
    .getAll()
    .then((data) => {
      res.locals.categories = data;
      return productController.getTrendingProducts();
    })
    .then((data) => {
      res.locals.trendingProducts = data;
      res.render("index");
    })
    .catch((error) => next(error));
});

module.exports = router;
