module.exports.isLoggedIn = (req, res, next)=>{
  console.log("REQ. USER..", req.user)
  if (!req.isAuthenticated()) {
    // store the url where they want to go 
    req.session.returnTo =  req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }

next();

}

