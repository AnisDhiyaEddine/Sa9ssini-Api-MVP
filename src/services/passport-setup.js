const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
const LinkedinStrategy = require("passport-linkedin-oauth2").Strategy;
const User = require("../models/user");

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
      clientID: process.env.githubClientId,
      clientSecret: process.env.githubClientSecret,
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

passport.use(
  new LinkedinStrategy(
    {
      // options for linkedin strategy
      clientID: process.env.linkedClientId,
      clientSecret: process.env.linkedClientSecret,
      callbackURL: "/auth/linkedin/redirect",
    },
    async (accessToken, refreshToken, r_liteprofile, done) => {
      //check if user exists
      let user;

      try {
        user = await User.findOne({ linkedinId: r_liteprofile.id });

        if (user) {
          done(null, user);
        } else {
          user = new User({
            userName: r_liteprofile.displayName,
            imgUrl: r_liteprofile._json.profilePicture.displayImage,
            linkedinId: r_liteprofile.id,
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
