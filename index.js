const express = require("express");
const expressHandlebars = require("express-handlebars");
const { createPagination } = require("express-handlebars-paginate");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");

const Cart = require("./controllers/cartController");
const {
  calculateStartIndex,
  createStart,
  createStartInComment,
} = require("./controllers/helper");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public"));

const hbs = expressHandlebars.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
  helpers: {
    calculateStartIndex,
    createStart,
    createStartInComment,
    createPagination,
  },
});

app.engine("hbs", hbs.engine);

app.set("port", PORT);

app.set("view engine", "hbs");

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//expressSession
app.use(
  expressSession({
    cookie: { httpOnly: true, maxAge: null },
    secret: "123123",
    resave: false,
    saveUninitialized: false,
  })
);

//cookie parse
app.use(cookieParser());

app.use((req, res, next) => {
  const cart = new Cart(req.session.cart || {});
  req.session.cart = cart;
  res.locals.totalQuantity = cart.totalQuantity;
  res.locals.fullname = req.session.user ? req.session.user.fullname : "";
  res.locals.isLoggedIn = req.session.user ? true : false;

  next();
});

app.use("/", require("./routers/indexRouter"));

app.use("/products", require("./routers/productRouter"));

app.use("/cart", require("./routers/cartRouter"));

app.use("/comments", require("./routers/commentRouter"));

app.use("/reviews", require("./routers/reviewRouter"));

app.use("/user", require("./routers/userRouter"));

app.get("/sync", (req, res) => {
  const models = require("./models");
  models.sequelize.sync().then(() => {
    res.send("Sync database successfully");
  });
});

app.get("/:page", (req, res) => {
  const page = req.params.page;

  const banners = {
    blog: "Our Blog",
    contact: "Contact Us",
    category: "Shop Category",
    // "single-product": "Shop Single",
    checkout: "SProduct Checkout",
    confirmation: "Order Confirmation",
    // cart: "Shopping Cart",
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
