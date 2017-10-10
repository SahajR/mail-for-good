const passport = require('passport');

const secrets = require('../secrets');
const db = require('../../models');
const Auth0 = require('../passport/auth0');

module.exports = () => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.user.findById(id).then(user => {
      done(null, user);
      return null;
    }).catch(err => {
      if (err) { throw err; }
      }
    );
  });
  ///////////////////////////////
  /* AUTHENTICATION STRATEGIES */
  ///////////////////////////////
  Auth0(passport, secrets.auth0);
};
