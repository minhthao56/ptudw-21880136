const models = require("../models");
const { Op } = require("sequelize");

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

  getAll: ({
    category,
    branch,
    color,
    max,
    min,
    sort,
    limit,
    search,
    page,
  }) => {
    let options = {
      attributes: ["id", "name", "imagepath", "price"],
      include: [{ model: models.Category }],
      order: [],
      where: {},
    };

    if (!isNaN(parseInt(category))) {
      options.where.categoryId = category;
    }
    if (!isNaN(parseInt(branch))) {
      options.where.brandId = branch;
    }
    if (!isNaN(parseInt(color))) {
      options.include.push({
        model: models.ProductColor,
        attributes: [],
        where: { colorId: color },
      });
    }
    if (!isNaN(parseFloat(max)) && !isNaN(parseFloat(min))) {
      options.where.price = {
        [Op.gte]: min,
        [Op.lte]: max,
      };
    }
    if (sort) {
      switch (sort) {
        case "name":
          options.order.push(["name", "ASC"]);
          break;
        case "price":
          options.order.push(["price", "ASC"]);
          break;
        case "overallReview":
          options.order.push(["overallReview", "DESC"]);
          break;
        default:
          options.order.push(["name", "ASC"]);
      }
    }
    if (limit && !isNaN(parseInt(limit))) {
      options.limit = limit;
      if (page && !isNaN(parseInt(page))) {
        options.offset = limit * (page - 1);
      }
    }

    if (search) {
      options.where.name = {
        [Op.iLike]: `%${search}%`,
      };
    }
    return new Promise((resolve, reject) => {
      Product.findAndCountAll(options)
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

  updateOverallReviewProduct: async (id, overallReview, reviewCount) => {
    try {
      return await Product.update(
        { overallReview, reviewCount },
        {
          where: { id },
        }
      );
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = controller;
