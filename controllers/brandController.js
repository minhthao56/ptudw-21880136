const models = require("../models");
const { Op } = require("sequelize");

const Brand = models.Brand;

const controller = {
  getAll: ({ category, color, max, min, search }) => {
    const options = {
      attributes: ["id", "name", "imagepath"],
      include: [{ model: models.Product, where: {}, include: [], order: [] }],
    };

    if (!isNaN(parseInt(category))) {
      options.include[0].where.categoryId = category;
    }

    if (!isNaN(parseInt(color))) {
      options.include[0].include.push({
        model: models.ProductColor,
        attributes: [],
        where: { colorId: color },
      });
    }
    if (!isNaN(parseFloat(max)) && !isNaN(parseFloat(min))) {
      options.include[0].where.price = {
        [Op.gte]: min,
        [Op.lte]: max,
      };
    }

    if (search) {
      options.include[0].where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    return new Promise((resolve, reject) => {
      Brand.findAll(options)
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },
};

module.exports = controller;
