import React from "react";

import { auth } from "@/auth";
import SubscriptionCard from "@/components/subscription/subscription-card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSubscriptionByEmail } from "@/data/subscription";

type Props = {};

const BillingComponent = async (props: Props) => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return <div>Not authenticated</div>;
  }
  const subscription = await getSubscriptionByEmail(session.user.email);

  return (
    <div className="flex flex-grow flex-col gap-2 container mt-8">
      <div className="flex flex-col w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <Label className="text-muted-foreground">
          Manage your subscription
        </Label>
      </div>
      <Separator className="my-6" />
      {subscription ? (
        <SubscriptionCard subscription={subscription} />
      ) : (
        <SubscriptionCard
          subscription={{
            id: "subscription",
            plan: "basic",
            status: "active",
            startDate: new Date(0),
            endDate: new Date(3155760000000),
          }}
        />
      )}
    </div>
  );
};

export default BillingComponent;
