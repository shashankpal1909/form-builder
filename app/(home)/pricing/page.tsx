"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

import styles from "./pricing.module.css";

interface PricingTierFrequency {
  id: string;
  value: string;
  label: string;
  priceSuffix: string;
}

interface PricingTier {
  name: string;
  id: string;
  href: string | Record<string, string>;
  discountPrice: string | Record<string, string>;
  price: string | Record<string, string>;
  description: string | React.ReactNode;
  features: string[];
  featured?: boolean;
  highlighted?: boolean;
  cta: string;
  soldOut?: boolean;
}

const frequencies: PricingTierFrequency[] = [
  { id: "1", value: "1", label: "Monthly", priceSuffix: "/month" },
  { id: "2", value: "2", label: "Annually", priceSuffix: "/year" },
];

const tiers: PricingTier[] = [
  {
    name: "Basic Plan - Free",
    id: "0",
    href: { "1": "/sign-up", "2": "/sign-up" },
    price: { "1": "₹0", "2": "₹0" },
    discountPrice: { "1": "", "2": "" },
    description: ``,
    features: [
      `Basic form creation tools`,
      `Limited form submissions per month (e.g., up to 100 submissions)`,
      `Basic customization options (e.g., form colors, fonts)`,
      `Email notifications for form submissions`,
      `Standard support`,
    ],
    featured: false,
    highlighted: false,
    soldOut: false,
    cta: `Sign Up`,
  },
  {
    name: "Starter Plan",
    id: "1",
    href: {
      "1": "/subscribe?plan=starter&frequency=monthly",
      "2": "/subscribe?plan=starter&frequency=yearly",
    },
    price: { "1": "₹699", "2": "₹6,999" },
    discountPrice: { "1": "", "2": "" },
    description: ``,
    features: [
      `Increased form submissions (e.g., up to 500 submissions)`,
      `Advanced customization options (e.g., custom branding, CSS customization)`,
      `Integration with popular apps (e.g., Google Sheets, Mailchimp)`,
      `Priority email support`,
      `Access to basic analytics and reporting`,
    ],
    featured: false,
    highlighted: false,
    soldOut: false,
    cta: `Get started`,
  },
  {
    name: "Professional Plan",
    id: "2",
    href: {
      "1": "/subscribe?plan=professional&frequency=monthly",
      "2": "/subscribe?plan=professional&frequency=yearly",
    },
    price: { "1": "₹2,099", "2": "₹20,999" },
    discountPrice: { "1": "", "2": "" },
    description: ``,
    features: [
      `Unlimited form submissions`,
      `Advanced field types (e.g., file uploads, payment fields)`,
      `Conditional logic for dynamic forms`,
      `Advanced analytics and reporting tools`,
      `API access for integration with third-party systems`,
      `Dedicated customer support`,
    ],
    featured: true,
    highlighted: false,
    soldOut: false,
    cta: `Get started`,
  },
];

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default function PricingPage() {
  const [frequency, setFrequency] = useState(frequencies[0]);

  const bannerText = "";

  return (
    <div
      className={cn(
        "container mt-8 flex flex-col w-full items-center",
        styles.fancyOverlay
      )}
    >
      <div className="w-full flex flex-col items-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
          <div className="w-full lg:w-auto mx-auto max-w-4xl lg:text-center">
            <h1 className="text-black dark:text-white text-4xl font-semibold max-w-xs sm:max-w-none md:text-6xl !leading-tight">
              Pricing
            </h1>
          </div>

          {bannerText ? (
            <div className="w-full lg:w-auto flex justify-center my-4">
              <p className="w-full px-4 py-3 text-xs bg-slate-100 text-black dark:bg-slate-300/30 dark:text-white/80 rounded-xl">
                {bannerText}
              </p>
            </div>
          ) : null}

          {frequencies.length > 1 ? (
            <div className="mt-16 flex justify-center">
              <RadioGroup
                defaultValue={frequency.value}
                onValueChange={(value: string) => {
                  setFrequency(frequencies.find((f) => f.value === value)!);
                }}
                className="grid gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 bg-white dark:bg-black ring-1 ring-inset ring-gray-200/30 dark:ring-gray-800"
                style={{
                  gridTemplateColumns: `repeat(${frequencies.length}, minmax(0, 1fr))`,
                }}
              >
                <Label className="sr-only">Payment frequency</Label>
                {frequencies.map((option) => (
                  <Label
                    className={cn(
                      frequency.value === option.value
                        ? "bg-slate-500/90 text-white dark:bg-slate-900/70 dark:text-white/70"
                        : "bg-transparent text-gray-500 hover:bg-slate-500/10",
                      "cursor-pointer rounded-full px-2.5 py-2 transition-all"
                    )}
                    key={option.value}
                    htmlFor={option.value}
                  >
                    {option.label}

                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="hidden"
                    />
                  </Label>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="mt-12" aria-hidden="true"></div>
          )}

          <div
            className={cn(
              "isolate mx-auto mt-4 mb-28 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none",
              tiers.length === 2 ? "lg:grid-cols-2" : "",
              tiers.length === 3 ? "lg:grid-cols-3" : ""
            )}
          >
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  tier.featured
                    ? "!bg-gray-900 ring-gray-900 dark:!bg-gray-100 dark:ring-gray-100"
                    : "bg-white dark:bg-gray-900/80 ring-gray-300/70 dark:ring-gray-700",
                  "max-w-xs ring-1 rounded-3xl p-8 xl:p-10",
                  tier.highlighted ? styles.fancyGlassContrast : ""
                )}
              >
                <h3
                  id={tier.id}
                  className={cn(
                    tier.featured
                      ? "text-white dark:text-black"
                      : "text-black dark:text-white",
                    "text-2xl font-bold tracking-tight"
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    tier.featured
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-600 dark:text-gray-400",
                    "mt-4 text-sm leading-6"
                  )}
                >
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span
                    className={cn(
                      tier.featured
                        ? "text-white dark:text-black"
                        : "text-black dark:text-white",
                      "text-4xl font-bold tracking-tight",
                      tier.discountPrice &&
                        (typeof tier.discountPrice === "string"
                          ? tier.discountPrice
                          : tier.discountPrice[frequency.value])
                        ? "line-through"
                        : ""
                    )}
                  >
                    {typeof tier.price === "string"
                      ? tier.price
                      : tier.price[frequency.value]}
                  </span>

                  <span
                    className={cn(
                      tier.featured
                        ? "text-white dark:text-black"
                        : "text-black dark:text-white"
                    )}
                  >
                    {typeof tier.discountPrice === "string"
                      ? tier.discountPrice
                      : tier.discountPrice[frequency.value]}
                  </span>

                  {typeof tier.price !== "string" ? (
                    <span
                      className={cn(
                        tier.featured
                          ? "text-gray-300 dark:text-gray-500"
                          : "dark:text-gray-400 text-gray-600",
                        "text-sm font-semibold leading-6"
                      )}
                    >
                      {frequency.priceSuffix}
                    </span>
                  ) : null}
                </p>
                <a
                  href={
                    typeof tier.href === "string"
                      ? tier.href
                      : tier.href[frequency.value]
                  }
                  aria-describedby={tier.id}
                  className={cn(
                    "flex mt-6 shadow-sm",
                    tier.soldOut ? "pointer-events-none" : ""
                  )}
                >
                  <Button
                    size="lg"
                    disabled={tier.soldOut}
                    className={cn(
                      "w-full text-black dark:text-white",
                      !tier.highlighted && !tier.featured
                        ? "bg-gray-100 dark:bg-gray-600"
                        : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-700",
                      tier.featured || tier.soldOut
                        ? "bg-white dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-black"
                        : "hover:opacity-80 transition-opacity"
                    )}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {tier.soldOut ? "Sold out" : tier.cta}
                  </Button>
                </a>

                <ul
                  className={cn(
                    tier.featured
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-400",
                    "mt-8 space-y-3 text-sm leading-6 xl:mt-10"
                  )}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        className={cn(
                          tier.featured ? "text-white dark:text-black" : "",
                          tier.highlighted ? "text-slate-500" : "text-gray-500",

                          "h-6 w-5 flex-none"
                        )}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
