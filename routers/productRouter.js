const express = require("express");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const brandController = require("../controllers/brandController");
const colorController = require("../controllers/colorController");
const productSpecificationController = require("../controllers/productSpecificationController");
const commentController = require("../controllers/commentController");
const reviewController = require("../controllers/reviewController");

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

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  let product;
  productController
    .getProductById(id)
    .then((data) => {
      product = data;
      return productSpecificationController.getAllById(id);
    })
    .then((ProductSpecifications) => {
      product.ProductSpecifications = ProductSpecifications;
      return commentController.getCommentByProductId(id);
    })
    .then((comments) => {
      product.comments = comments;
      return reviewController.getReviewByProductId(id);
    })
    .then((reviews) => {
      product.reviews = reviews;
      const starts = [];

      for (let i = 1; i <= 5; i++) {
        const count = reviews.filter((item) => item.rating == i).length;
        starts.push(count);
      }

      product.starts = starts.reverse();
      res.locals.product = product;
      res.render("single-product", { banner: "Shop Single" });
    })
    .catch((error) => next(error));
});

module.exports = router;
