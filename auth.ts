import NextAuth from "next-auth";
import Stripe from "stripe";

import { PrismaAdapter } from "@auth/prisma-adapter";

import { authConfig } from "./auth.config";
import { getAccountByUserId } from "./data/account";
import { getUserById, updateStripeCustomerId } from "./data/user";
import { db } from "./lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);

      // Prevent sign in without email verification
      return !!existingUser?.emailVerified;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name!;
        session.user.email = token.email!;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (existingUser && !existingUser.stripeCustomerId) {
        if (existingUser.name && existingUser.email) {
          // Create stripe customer here
          const customer = await stripe.customers.create({
            name: existingUser.name,
            email: existingUser.email,
          });
          console.log("stripe customer created", customer);

          await updateStripeCustomerId(existingUser.id, customer.id);
        }
      }

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;

      return token;
    },
  },
  ...authConfig,
});
