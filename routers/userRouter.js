const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.get("/login", (req, res, next) => {
  const urlReturn = req.query.urlReturn;
  req.session.urlReturn = urlReturn;

  res.render("login");
});

router.post("/login", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const keepLoginIn = req.body.keepLoginIn;
  const urlReturn = req.session.urlReturn;
  try {
    const userInDB = await userController.getUserByUsername(username);
    if (userInDB) {
      const hash = userInDB.password;
      const isMatched = userController.comparePassword(password, hash);
      if (isMatched) {
        req.session.user = userInDB;

        if (keepLoginIn) {
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        } else {
          req.session.cookie.maxAge = null;
        }

        if (urlReturn) {
          res.redirect(urlReturn);
        } else {
          res.redirect("/");
        }
      } else {
        res.render("login", {
          message: `Your password was wrong`,
          type: "alert-danger",
        });
      }
    } else {
      res.render("login", {
        message: `Your username was not existed`,
        type: "alert-danger",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.post("/register", async (req, res, next) => {
  const username = req.body.username;
  const fullname = req.body.fullname;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const keepLoginIn = req.body.keepLoginIn;

  if (!username) {
    res.render("register", {
      message: `You missed username`,
      type: "alert-danger",
    });
    return;
  }

  if (!password) {
    res.render("register", {
      message: `You missed password`,
      type: "alert-danger",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.render("register", {
      message: `Password and password confirm is not matched`,
      type: "alert-danger",
    });
    return;
  }

  try {
    const user = await userController.getUserByUsername(username);
    if (user) {
      res.render("register", {
        message: `user ${user.username} is existed`,
        type: "alert-danger",
      });
    } else {
      const user = { username, fullname, password };

      if (keepLoginIn) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
      } else {
        req.session.cookie.maxAge = null;
      }

      await userController.createUser(user);
      res.render("register", {
        message: `Your account was registered. Go to login page to login`,
        type: "alert-info",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;
