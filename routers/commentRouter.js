const express = require("express");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.post("/", async (req, res, next) => {
  const productId = req.body.productId;
  const message = req.body.message;
  const userId = 1;
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
