"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react";

import LoadingComponent from "@/components/loading";
import { Button } from "@/components/ui/button";
import { getSubscriptionByEmail } from "@/data/subscription";
import { Label } from "@radix-ui/react-dropdown-menu";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Plan = "starter" | "professional";
type Frequency = "monthly" | "yearly";

export default function SubscribeComponent() {
  const params = useSearchParams();
  let plan: Plan = "starter";
  let frequency: Frequency = "monthly";
  const router = useRouter();

  const [alreadySubscribed, setAlreadySubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if plan is provided in URL
  const planParam = params.get("plan");
  if (planParam && (planParam === "starter" || planParam === "professional")) {
    plan = planParam;
  }

  // Check if frequency is provided in URL
  const frequencyParam = params.get("frequency");
  if (
    frequencyParam &&
    (frequencyParam === "monthly" || frequencyParam === "yearly")
  ) {
    frequency = frequencyParam;
  }

  const fetchClientSecret = useCallback(async () => {
    // Create a Checkout Session
    const res = await fetch("/api/checkout_sessions", {
      method: "POST",
      body: JSON.stringify({
        plan,
        frequency,
      }),
    });
    const data = await res.json();
    return data.clientSecret;
  }, [frequency, plan]);

  const session = useSession();

  useEffect(() => {
    const getSubscription = async () => {
      setLoading(true);
      const response = await fetch(`/api/subscription`);
      const { subscription } = await response.json();
      console.log(subscription);

      if (subscription && subscription.status === "active") {
        setAlreadySubscribed(true);
      }
      setLoading(false);
    };

    getSubscription();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  if (alreadySubscribed) {
    return (
      <div className="flex flex-col gap-4 flex-grow justify-center items-center">
        <h1 className="text-2xl font-bold">You have already subscribed!</h1>
        <Button
          className="rounded-full"
          size={"lg"}
          onClick={() => router.push("/billing")}
        >
          Manage Subscription
        </Button>
      </div>
    );
  }

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
