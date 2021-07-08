if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const user = require("./models/user");
const { format } = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const userRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");

// mongodb://localhost:27017/yelp-camp
// const dbUrl = process.env.DB_URL;
const MongoDBStore = require("connect-mongodb-session")(session);
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
// console.log(dbUrl);
mongoose.Promise = global.Promise;
// const dbUrl = "mongodb+srv://viper:Abhi19961@cluster1-n60yg.mongodb.net/Cluster0?retryWrites=true";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// mongoose.set("useFindAndModify", false);

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const secret =  "thisshouldbeabettersecret!";

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

// ========== for session and flash messages
app.use(session(sessionConfig));
app.use(flash());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// ============= for passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // Storage
passport.deserializeUser(User.deserializeUser()); // Unstorage

app.use((req, res, next) => {
  console.log(req.query);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// /register
// POST / register - a user
// /login -- login form
// POST /login - for user login

app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

// Route Setting -- REST API's
app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something went Wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

// POST campground/:id/reviews

// WM0NQ8CmmwVu4SPW == MONGO DB PASSWORD
