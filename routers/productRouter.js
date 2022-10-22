const express = require("express");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");
const brandController = require("../controllers/brandController");
const colorController = require("../controllers/colorController");
const productSpecificationController = require("../controllers/productSpecificationController");
const commentController = require("../controllers/commentController");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

// List page
router.get("/", (req, res, next) => {
  const {
    category,
    branch,
    color,
    max = 100,
    min = 0,
    sort,
    limit,
    search,
    page,
  } = req.query;

  categoryController
    .getAll()
    .then((data) => {
      res.locals.categories = data;
      return brandController.getAll({
        category,
        color,
        max,
        min,
        search,
      });
    })
    .then((data) => {
      res.locals.brands = data;
      return colorController.getAll({
        category,
        branch,
        max,
        min,
        search,
      });
    })
    .then((data) => {
      res.locals.colors = data;
      return productController.getAll({
        category,
        branch,
        color,
        max,
        min,
        sort,
        limit,
        search,
        page,
      });
    })
    .then((data) => {
      res.locals.products = data.rows;
      res.locals.pagination = {
        page: page ? parseInt(page) : 0,
        limit: limit ? parseInt(limit) : 9,
        totalRows: data.count,
      };
      res.render("category", { banner: "Products" });
    })
    .catch((error) => next(error));
});

// Detail page
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
