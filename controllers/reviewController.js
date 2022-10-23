const models = require("../models");
const productController = require("./productController");

const Review = models.Review;

const controller = {};

controller.getReviewByProductId = (id) => {
  return new Promise((resolve, reject) => {
    Review.findAll({
      where: { productId: id },
      include: [{ model: models.User }],
    })
      .then((data) => resolve(data))
      .catch((error) => reject(new Error(error)));
  });
};

controller.getReviewByProductIdAndUserId = async ({ productId, userId }) => {
  try {
    return await Review.findOne({
      where: { productId, userId },
    });
  } catch (error) {
    throw Error(error);
  }
};

controller.createOrUpdateReview = async ({
  message,
  rating,
  productId,
  userId,
}) => {
  try {
    const reviewData = await controller.getReviewByProductIdAndUserId({
      productId,
      userId,
    });
    if (reviewData) {
      await Review.update(
        { message, rating },
        {
          where: { productId, userId },
        }
      );
    } else {
      await Review.create({ message, rating, productId, userId });
    }

    const allReviewProduct = await Review.findAll({
      where: { productId },
    });

    const sum = allReviewProduct.reduce((acc, current) => {
      return acc + current.rating;
    }, 0);

    const avg = (sum / allReviewProduct.length).toFixed(2);

    await productController.updateOverallReviewProduct(
      productId,
      avg,
      allReviewProduct.length
    );
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = controller;
