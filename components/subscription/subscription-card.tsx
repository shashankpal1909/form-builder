import React from "react";

import { Badge } from "@/components/ui/badge";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  startDate: Date;
  endDate: Date;
}

interface SubscriptionCardProps {
  subscription: Subscription;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
}) => {
  const { plan } = subscription;

  // Function to determine the gradient colors based on the subscription plan
  const getGradientColors = (plan: string) => {
    switch (plan) {
      case "starter":
        return "from-green-400 to-blue-500";
      case "professional":
        return "from-purple-400 to-indigo-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg shadow-lg">
      <div
        className={`absolute inset-0 bg-gradient-to-r opacity-75 animate-gradient ${getGradientColors(
          plan
        )} rounded-lg`}
      ></div>
      <div className="relative z-10 p-8">
        <div className="flex gap-2">
          <h2 className="text-xl font-semibold ">
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </h2>
          <Badge className="rounded-full">
            {subscription.status.toUpperCase()}
          </Badge>
        </div>
        <p className="mt-4 text-sm ">
          {subscription.startDate.toDateString()} -{" "}
          {subscription.endDate.toDateString()}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCard;
