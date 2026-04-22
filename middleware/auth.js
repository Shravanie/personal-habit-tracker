module.exports = {
  ensureAuth: function (req, res, next) {
    console.log("AUTH CHECK:", {
      isAuth: req.isAuthenticated(),
      user: req.user,
      session: req.session,
    });

    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/login");
    }
  },

  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/dashboard");
    } else {
      return next();
    }
  },
};
