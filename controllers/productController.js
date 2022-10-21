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

  getAll: () => {
    return new Promise((resolve, reject) => {
      Product.findAll({
        attributes: ["id", "name", "imagepath", "price"],
        include: [{ model: models.Category }],
        order: [["overallReview", "DESC"]],
      })
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },

  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      Product.findOne({
        where: { id },
        include: [{ model: models.Category }],
      })
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },
};

module.exports = controller;
