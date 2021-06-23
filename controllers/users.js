const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
  // res.send(req.body);
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // ========== Passport register -- redirect login
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to CampSites");
      res.redirect("/campgrounds");
    });
    console.log(registeredUser);
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirecUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirecUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Good Bye!");
  res.redirect("/campgrounds");
};