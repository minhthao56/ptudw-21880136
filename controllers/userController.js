var bcrypt = require("bcryptjs");

const models = require("../models");

const User = models.User;

const controller = {};

controller.getUserByUsername = async (username) => {
  try {
    return await User.findOne({
      where: { username },
    });
  } catch (error) {
    throw new Error(error);
  }
};
controller.createUser = async (user) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  try {
    return await User.create(user);
  } catch (error) {
    throw new Error(error);
  }
};

controller.comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

controller.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect(`/user/login?urlReturn=${req.originalUrl}`);
  }
};

module.exports = controller;
