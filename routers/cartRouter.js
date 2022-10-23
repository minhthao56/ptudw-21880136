const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/", (req, res) => {
  const cart = req.session.cart;
  res.locals.cart = cart.getCart();
  res.render("cart");
});

router.post("/", (req, res, next) => {
  const productId = req.body.id;
  const quantity = !isNaN(parseInt(req.body.quantity))
    ? parseInt(req.body.quantity)
    : 1;

  productController
    .getProductById(productId)
    .then((product) => {
      const itemCart = req.session.cart.add(product, productId, quantity);
      res.json(itemCart);
    })
    .catch((error) => next(error));
});

router.put("/", (req, res) => {
  const productId = req.body.id;
  const quantity = parseInt(req.body.quantity);
  const itemCart = req.session.cart.update(productId, quantity);
  res.json(itemCart);
});

router.delete("/", (req, res) => {
  const productId = req.body.id;
  const cart = req.session.cart;
  cart.remove(productId);

  res.json({
    totalQuantity: cart.totalQuantity,
    totalPrice: cart.totalPrice,
  });
});

router.delete("/all", (req, res) => {
  req.session.cart.empty();
  res.status(204);
  res.end();
});

module.exports = router;
