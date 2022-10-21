const models = require("../models");

const ProductSpecification = models.ProductSpecification;

const controller = {
  getAllById: (id) => {
    return new Promise((resolve, reject) => {
      ProductSpecification.findAll({
        where: { productId: id },
        include: [{ model: models.Specification }],
      })
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },
};

module.exports = controller;
