import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { auth } from "@/auth";
import { getUserByEmail, getUserById } from "@/data/user";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const prices = {
  starter: {
    monthly: "price_1PC5HpSHQ0lbv5wZunECcxr5",
    yearly: "price_1PC5INSHQ0lbv5wZTv7ETaUS",
  },
  professional: {
    monthly: "price_1PCfYNSHQ0lbv5wZvYAv6FOL",
    yearly: "price_1PFgVhSHQ0lbv5wZoO5ZVp55",
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan: "starter" | "professional" = body.plan;
    const frequency: "monthly" | "yearly" = body.frequency;

    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return new Response(
        JSON.stringify({
          error: "not authenticated",
        }),
        {
          status: 401,
        }
      );
    }

    const user = await getUserByEmail(session.user.email);

    // Create Checkout Sessions from body params.
    const checkoutSession = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      customer: user?.stripeCustomerId || undefined,
      line_items: [
        {
          price: prices[plan][frequency],
          quantity: 1,
        },
      ],
      billing_address_collection: "required",
      currency: "inr",
      mode: "subscription",
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      payment_method_types: ["card"],
    });

    return new NextResponse(
      JSON.stringify({ clientSecret: checkoutSession.client_secret }),
      { status: 200 }
    );
  } catch (err: any) {
    console.log("err", err);
    return new NextResponse(err.message, {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.nextUrl.searchParams.get("session_id") ?? ""
    );

    return new NextResponse(
      JSON.stringify({
        status: session.status,
        customer_email: session.customer_details?.email,
      })
    );
  } catch (err: any) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
}
