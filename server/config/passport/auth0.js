const Auth0Strategy = require('passport-auth0');
const db = require('../../models');

module.exports = (passport, secret) => {
    const {domain, clientID, clientSecret, callbackURL} = secret;
    passport.use(new Auth0Strategy({
        domain,
        clientID,
        clientSecret,
        callbackURL
    }, (token, tokenSecret, _, profile, done) => {
        // Prefer email as ID over profileID from different providers if it exists
        const userID = profile._json.email || profile._json.sub;
        db.user.findOne({
            where: {
                userID
            }
        }).then(userExists => {
            if (userExists) {
                done(null, userExists);
            } else {
                let newUserCreated;
                db.sequelize.transaction(t => {
                    return db.user.create({
                        userID,
                        token,
                        email: profile._json.email,
                        // Nickname is more meaningful in the Auth0 profile response
                        name: profile._json.nickname || profile._json.name,
                        picture: profile._json.picture || "http://www.pieglobal.com/wp-content/uploads/2015/10/placeholder-user.png"
                    }, { transaction: t })
                        .then(newUser => {
                            newUserCreated = newUser;
                            return db.setting.create({ userId: newUser.id }, { transaction: t });
                        });
                }).then(() => {
                    done(null, newUserCreated);
                }).catch(err => {
                    done(err);
                });
            }
            return null;
        }).catch(err => {
            done(err);
        });
    }));
};
