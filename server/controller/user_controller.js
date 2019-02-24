const User = require('../models/user_model');
const VerifyListing = require('../models/verify_user_model');

exports.isUserLoggedIn = async (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    req.flash('signinError', 'Please Sign in');
    res.redirect('/?showdefaultmodal=true');
  }

}

exports.isLoggedIn = async (req, res, next) => {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  req.flash('signinError', 'Please Sign in');
  res.redirect('/?showdefaultmodal=true');
}

exports.redirectIfLoggedIn = (req, res, next) => {

  if (req.isAuthenticated())
    res.redirect('/profile');
  else {
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
  res.render('register-new')
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
        res.redirect('/?showdefaultmodal=true');
      }
    } else {
      req.flash('signinError', 'Wrong Email Address or Password');
      res.redirect('/?showdefaultmodal=true');
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
    console.log(error.message);
    req.flash('signupError', error.message);
    return res.redirect('back');
  }
}

exports.signout = async (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  })
}

exports.updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password;
    const confirmNewPassword = req.body.confirm_new_password;
    if (newPassword !== confirmNewPassword) {
      req.flash('profileEditError', 'New passwords do not match');
      return res.redirect('back');
    }
    if (oldPassword && newPassword && confirmNewPassword) {
      const doPasswordsMatch = await user.validatePassword(oldPassword);
      if (doPasswordsMatch) {
        const hashedPassword = await user.hashNewPassword(newPassword)
        req.body.password = hashedPassword;
      } else {
        req.flash('profileEditError', 'Old password is incorrect');
        return res.redirect('back');
      }
    }
    const userUpdated = await User.findByIdAndUpdate(req.params.userId, req.body, {
      upsert: true
    })
    req.flash('profileEditSuccess', 'Profile Updated Successfully');
    res.redirect('back');
  } catch (error) {
    req.flash('profileEditError', 'Error occured, please try again');
    res.redirect('back');
  }
}

exports.VerifyProcess = async (req, res, next) => {
  try {
    var listing = req.body.listing
    const user = res.locals.currentUser;
    res.render('verify-listing', { listing, user })

  }
  catch (e) {
    console.log("error");
  }
}

exports.uploadVerification = async (req, res, next) => {
  try {
    console.log("entered");
    const listing = req.params.listing;
    const user = res.locals.currentUser
    var listing_details = { listing_name: listing.title, listing_id: listing._id, owner: user._id }
    for (const image in req.files) {
      if (listing.images.length >= 5) {
        return res.status(401).send('Error : Maximum Images reached, delete some');
      } else {
        const result = await upload(req.files[image]);
        if (result.public_id == null || result.url == null) {
          return res
            .status(401)
            .send("Error uploading images, please try again");
        }

        var documents = {
          public_id: result.public_id,
          url: result.url,
          secure_url: result.secure_url
        }
        listing_details.verification_documents.push(documents)
      }
    }

    await new VerifyListing(listing_details).save();
    res.send("Upload Complete");
  } catch (error) {
    console.log("error is ",error)
  }
}

exports.claimListing = async (req, res, next) => {
  try {
    var listing = req.params.listing
    res.locals.currentUser
    var verify = { listing_name: listing.title, listing_id: listing._id, }

  }
  catch (e) {

  }
}

exports.bookmarkListing = async (req, res, next) => {
  try {
    const listing = req.params.listingId;
    const bookmarks = res.locals.currentUser.bookmarks.map(_id => _id.toString());
    const operator = bookmarks.includes(listing.toString()) ? '$pull' : '$addToSet';
    const saveBookmark = await User.findByIdAndUpdate(res.locals.currentUser._id, {
      [operator]: {
        bookmarks: listing
      }
    })
    res.json(saveBookmark);
  } catch (error) {
    res.send(error.message);
  }
}