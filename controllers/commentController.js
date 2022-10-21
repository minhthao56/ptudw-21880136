const models = require("../models");

const Comment = models.Comment;

const controller = {
  getCommentByProductId: (id) => {
    return new Promise((resolve, reject) => {
      Comment.findAll({
        where: { productId: id },
        include: [{ model: models.User }],
      })
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },
};

module.exports = controller;
