const models = require("../models");

const Comment = models.Comment;

const controller = {
  getCommentByProductId: (id) => {
    return new Promise((resolve, reject) => {
      Comment.findAll({
        where: { productId: id, parentCommentId: null },
        include: [
          { model: models.User },
          {
            as: "SubComments",
            model: models.Comment,
            include: [{ model: models.User }],
          },
        ],
      })
        .then((data) => resolve(data))
        .catch((error) => reject(new Error(error)));
    });
  },

  createComment: async ({
    message,
    userId,
    productId,
    parentCommentId = null,
  }) => {
    try {
      return await Comment.create({
        message,
        userId,
        productId,
        parentCommentId,
      });
    } catch (error) {
      throw new Error(error);
    }
  },
};

module.exports = controller;
