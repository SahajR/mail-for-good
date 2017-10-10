const path = require('path');

module.exports = (app, passport) => {
  app.get('/login', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
  });

  // Redirect user to Google for authentication. When complete, Google will return the user to /auth/google/return
  // Ref https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
  app.get('/auth/auth0', passport.authenticate('auth0', {
    scope: ['openid profile']
  }));

  // Verify authentication with Passport. Send to /
  app.get('/auth/auth0/callback', passport.authenticate('auth0', {
    successRedirect: '/', //TODO: Change this to an authenticated url e.g. /a or /account. Can also redirect simply to / using a separate workflow
    failureRedirect: '/login'
  }));
};
