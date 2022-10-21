const models = require("../models");

const Review = models.Review;

const controller = {
  getReviewByProductId: (id) => {
    return new Promise((resolve, reject) => {
      Review.findAll({
        where: { productId: id },
        include: [{ model: models.User }],
      })
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },
};

module.exports = controller;
