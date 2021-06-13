const express = require('express')
const router = express.Router();
const User = require('../models/user');
const { route } = require('./campgrounds');
const catchAsync = require('../utils/catchAsync')
const passport = require('passport');

router.get('/register', (req, res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync(async(req, res)=>{
    // res.send(req.body);
    try{
    const {username, email, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    // ========== Passport register -- redirect login 
    req.login(registeredUser, err =>{
      if(err) return next(err);
      req.flash("success", "Welcome to CampSites");
      res.redirect("/campgrounds");
    })
    console.log(registeredUser);
    } catch(e){
        req.flash('error',e.message);
        res.redirect('register')
    }

}));

router.get('/login', (req, res)=>{
res.render('users/login');
})

// passport authenticate will automatically check for db for username and deserilixed password
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    
  }),
  (req, res) => {
      req.flash('success', 'Welcome back!')
     const redirecUrl = req.session.returnTo || "/campgrounds";
     delete req.session.returnTo
      res.redirect(redirecUrl)
  }
);

router.get('/logout', (req, res)=>{
  req.logout();
  req.flash('success', 'Good Bye!')
  res.redirect('/campgrounds')
})

module.exports = router;