const express = require("express");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/", userController.isLoggedIn, async (req, res, next) => {
  const productId = req.body.productId;
  const message = req.body.message;
  const userId = req.session.user.id;
  const parentCommentId = req.body.parentCommentId || null;
  try {
    await commentController.createComment({
      message,
      productId,
      userId,
      parentCommentId,
    });
    res.redirect("/products/" + productId);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
