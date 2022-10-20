const models = require("../models");

const Product = models.Product;

const controller = {
  getTrendingProducts: () => {
    return new Promise((resolve, reject) => {
      Product.findAll({
        attributes: ["id", "name", "imagepath", "price"],
        limit: 8,
        include: [{ model: models.Category }],
        order: [["overallReview", "DESC"]],
      })
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },
};

module.exports = controller;
