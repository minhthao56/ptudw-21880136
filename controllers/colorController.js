const models = require("../models");

const Color = models.Color;

const controller = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      Color.findAll({
        attributes: ["id", "name", "imagepath"],
        include: [{ model: models.ProductColor }],
      })
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },
};

module.exports = controller;
