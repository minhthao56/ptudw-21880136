const express = require("express");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const brandController = require("../controllers/brandController");
const colorController = require("../controllers/colorController");

const router = express.Router();

router.get("/", (req, res, next) => {
  categoryController
    .getAll()
    .then((data) => {
      res.locals.categories = data;
      return brandController.getAll();
    })
    .then((data) => {
      res.locals.brands = data;
      return colorController.getAll();
    })
    .then((data) => {
      res.locals.colors = data;
      return productController.getAll();
    })
    .then((data) => {
      res.locals.products = data;
      res.render("category", { banner: "Products" });
    })
    .catch((error) => next(error));
});

router.get("/:id", (req, res) => {
  res.render("single-product", { banner: "Shop Single" });
});

module.exports = router;
