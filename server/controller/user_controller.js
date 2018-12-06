const User = require('../models/user_model');

exports.isUserLoggedIn = async (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/');
  }

}

exports.redirectIfLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) {
    res.redirect('/profile');
  } else {
    next()
  }
}

exports.userProfile = async (req, res) => {
  const user = res.locals.currentUser;
  res.render('profile', {
    user
  });
}

exports.userSignupLogin = (req, res) => {
  res.render('register')
}

exports.signin = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;
    const user = await User.findOne({
      email
    });
    if (user) {
      const isValidPassword = await user.validatePassword(password);
      if (isValidPassword) {
        req.session.userId = user._id;
        return res.redirect('/profile');
      } else {
        req.flash('signinError', 'Wrong Email Address or Password');
        res.redirect('back');
      }
    } else {
      req.flash('signinError', 'Wrong Email Address or Password');
      res.redirect('back');
    }
  } catch (error) {
    next(error);
  }
}

exports.signup = async (req, res, next) => {
  try {
    const userInfo = req.body;
    if (userInfo.password !== userInfo.confirm_password) {
      req.flash('signupError', 'Password and Confirm Password field do not match');
      return res.redirect('back');
    }
    const user = await new User(req.body).save();
    req.session.userId = user._id;
    res.redirect('/profile');
  } catch (error) {
    return next(error);
  }
}

exports.signout = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('back');
  })
}