import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Email tidak ditemukan dari Google"));

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              username: profile.displayName || email.split("@")[0],
              email,
              password: "", // Google login tidak pakai password
              NoWA: "",
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

// NOTE: serializeUser/deserializeUser TIDAK dipakai karena kita stateless (JWT-based).
// passport.initialize() saja sudah cukup, tanpa passport.session().

export default passport;