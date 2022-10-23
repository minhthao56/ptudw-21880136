const express = require("express");
const reviewController = require("../controllers/reviewController");
const userController = require("../controllers/userController");
const router = express.Router();

router.post("/", userController.isLoggedIn, async (req, res, next) => {
  const productId = req.body.productIdReview;
  const message = req.body.message;
  const rating = req.body.rating;
  const userId = req.session.user.id;

  if (!rating) {
    res.status(400);
    res.render("Please rating product !!!");
    return;
  }
  try {
    await reviewController.createOrUpdateReview({
      message,
      productId,
      userId,
      rating,
    });
    res.redirect("/products/" + productId);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
