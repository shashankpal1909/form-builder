import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: NextRequest) {
  let event = null;
  const rawBody = await req.text();
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      req.headers.get("stripe-signature")!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("err", err);
    return new NextResponse(err.message, {
      status: 500,
    });
  }

  switch (event?.type) {
    case "customer.subscription.created": {
      const subscription = event?.data?.object;

      if (subscription.customer) {
        const user = await db.user.findUnique({
          where: { stripeCustomerId: subscription.customer.toString() },
        });

        if (user) {
          const sub = await db.subscription.create({
            data: {
              userId: user.id,
              status: subscription.status,
              plan:
                subscription.items.data[0].plan.metadata?.plan_type ||
                "unknown",
              stripeInvoiceId: subscription.latest_invoice?.toString() || "",
              stripeSubscriptionId: subscription.id,
              startDate: new Date(subscription.current_period_start * 1000),
              endDate: new Date(subscription.current_period_end * 1000),
            },
          });

          console.log("Subscription Created", sub);
        }
      }

      console.log("event", JSON.stringify(event));

      break;
    }

    case "customer.subscription.deleted":
    case "customer.subscription.updated": {
      const subscription = event?.data?.object;

      if (subscription.customer) {
        const user = await db.user.findFirst({
          where: { stripeCustomerId: subscription.customer.toString() },
        });

        if (user) {
          const sub = await db.subscription.upsert({
            where: { userId: user.id },
            update: {
              status: subscription.status,
              plan:
                subscription.items.data[0].plan.metadata?.plan_type ||
                "unknown",
              stripeInvoiceId: subscription.latest_invoice?.toString() || "",
              stripeSubscriptionId: subscription.id,
              startDate: new Date(subscription.current_period_start * 1000),
              endDate: new Date(subscription.current_period_end * 1000),
            },
            create: {
              userId: user.id,
              status: subscription.status,
              plan:
                subscription.items.data[0].plan.metadata?.plan_type ||
                "unknown",
              stripeInvoiceId: subscription.latest_invoice?.toString() || "",
              stripeSubscriptionId: subscription.id,
              startDate: new Date(subscription.current_period_start * 1000),
              endDate: new Date(subscription.current_period_end * 1000),
            },
          });

          console.log("Subscription Updated", sub);
        }
      }

      break;
    }

    default: {
      console.error(`Unhandled event type: ${event?.type}`);
      break;
    }
  }

  return new NextResponse();
}
