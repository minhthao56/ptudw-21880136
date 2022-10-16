const express = require("express");
const expressHandlebars = require("express-handlebars");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public"));

const hbs = expressHandlebars.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
});

app.engine("hbs", hbs.engine);

app.set("port", PORT);

app.set("view engine", "hbs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/:page", (req, res) => {
  const page = req.params.page;

  const banners = {
    blog: "Our Blog",
    contact: "Contact Us",
    category: "Shop Category",
    "single-product": "Shop Single",
    checkout: "SProduct Checkout",
    confirmation: "Order Confirmation",
    cart: "Shopping Cart",
    "single-blog": "Blog Details",
    login: "Login / Register",
    register: "Register",
    "tracking-order": "Order Tracking",
  };
  const title = banners?.[page];

  res.render(page, { banner: title });
});

app.listen(app.get("port"), () => {
  console.log(`Server is listening on port ${app.get("port")}`);
});
