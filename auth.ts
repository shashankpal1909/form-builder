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
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
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
