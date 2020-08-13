const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const LinkedinStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../models/user");
const keys = require("../../config/keys");
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      // options for github strategy
      clientID: keys.githubClientID,
      clientSecret: keys.githubClientSecret,
      callbackURL: "/auth/github/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      // check if user is registered
      let user;
      try {
        user = await User.findOne({ githubId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = new User({
            userName: profile.username,
            githubId: profile.id,
            email: "generic@gmail.com",
            password: "generic",
            gender: "not specific",
            imgUrl: profile._json.avatar_url,
          });
          await user.save();
          done(null, user);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new LinkedinStrategy(
    {
      // options for linkedin strategy
      clientID: keys.linkedinClientID,
      clientSecret: keys.linkedinClientSecret,
      callbackURL: "/auth/linkedin/redirect",
      scope: ["r_liteprofile"],
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      //check if user exists
      let user;

      try {
        user = await User.findOne({ linkedinId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user = new User({
            userName: profile.displayName,
            imgUrl: profile.photos[profile.photos.length - 1].value,
            linkedinId: profile.id,
            email: "generic@gmail.com",
            password: "generic",
            gender: "not specific",
          });
          user.save();
          done(null, user);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
);
