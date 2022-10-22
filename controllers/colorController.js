const models = require("../models");
const { Op } = require("sequelize");

const Color = models.Color;

const controller = {
  getAll: ({ category, branch, max, min, search }) => {
    const options = {
      attributes: ["id", "name", "imagepath"],
      include: [
        {
          model: models.ProductColor,
          include: [
            {
              model: models.Product,
              where: {},
              attributes: [],
              order: [],
            },
          ],
        },
      ],
    };

    if (!isNaN(parseInt(category))) {
      options.include[0].include[0].where.categoryId = category;
    }
    if (!isNaN(parseInt(branch))) {
      options.include[0].include[0].where.brandId = branch;
    }
    if (!isNaN(parseFloat(max)) && !isNaN(parseFloat(min))) {
      options.include[0].include[0].where.price = {
        [Op.gte]: min,
        [Op.lte]: max,
      };
    }

    if (search) {
      options.include[0].include[0].where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }
    return new Promise((resolve, reject) => {
      Color.findAll(options)
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },
};

module.exports = controller;
