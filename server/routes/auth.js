const path = require('path');

module.exports = (app, passport) => {
  app.get('/login', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
  });

  app.get('/auth/auth0', passport.authenticate('auth0', {
    scope: ['openid profile']
  }));

  // Verify authentication with Passport. Send to /
  app.get('/auth/auth0/callback',
      passport.authenticate('auth0', { failureRedirect: '/login' }),
      (req, res) => {
          if (!req.user) {
              throw new Error('user null');
          }
          res.redirect("/");
      }
  );

};
