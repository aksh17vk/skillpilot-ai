import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userRepository from "../repositories/user.repository.js";
import { AUTH_PROVIDER } from "../constants/auth.constants.js";

const githubClientId = process.env.GITHUB_CLIENT_ID || "placeholder_client_id";
const githubClientSecret =
  process.env.GITHUB_CLIENT_SECRET || "placeholder_client_secret";
const callbackURL =
  process.env.GITHUB_CALLBACK_URL ||
  "http://localhost:5000/api/v1/auth/github/callback";

passport.use(
  new GitHubStrategy(
    {
      clientID: githubClientId,
      clientSecret: githubClientSecret,
      callbackURL: callbackURL,
      scope: ["user:email"],
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void,
    ) => {
      try {
        const providerId = profile.id;
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.local`;
        const fullName =
          profile.displayName || profile.username || "GitHub User";
        const avatar = profile.photos?.[0]?.value || "";

        // Check if user exists by provider & providerId
        let user = await userRepository.findByProvider(
          AUTH_PROVIDER.GITHUB,
          providerId,
        );

        if (!user) {
          // Check if user exists by email
          user = await userRepository.findByEmail(email);
          if (user) {
            user.provider = AUTH_PROVIDER.GITHUB;
            user.providerId = providerId;
            if (avatar && !user.avatar) user.avatar = avatar;
            await user.save();
          } else {
            // Create new user
            user = await userRepository.create({
              fullName,
              email,
              provider: AUTH_PROVIDER.GITHUB,
              providerId,
              avatar,
              isEmailVerified: true,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    },
  ),
);

// Google OAuth Strategy
const googleClientId = process.env.GOOGLE_CLIENT_ID || "placeholder_google_client_id";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "placeholder_google_client_secret";
const googleCallbackURL =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:5000/api/v1/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackURL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void,
    ) => {
      try {
        const providerId = profile.id;
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        const fullName = profile.displayName || "Google User";
        const avatar = profile.photos?.[0]?.value || "";

        // Check if user exists by provider & providerId
        let user = await userRepository.findByProvider(
          AUTH_PROVIDER.GOOGLE,
          providerId,
        );

        if (!user) {
          // Check if user exists by email
          user = await userRepository.findByEmail(email);
          if (user) {
            user.provider = AUTH_PROVIDER.GOOGLE;
            user.providerId = providerId;
            if (avatar && !user.avatar) user.avatar = avatar;
            await user.save();
          } else {
            // Create new user
            user = await userRepository.create({
              fullName,
              email,
              provider: AUTH_PROVIDER.GOOGLE,
              providerId,
              avatar,
              isEmailVerified: true,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    },
  ),
);

export default passport;
