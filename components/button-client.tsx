"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "./ui/button";

type Props = {
  variant:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  href: string;
  text: string;
};

// navigation button component for server components

const NavigationButtonClientComponent = ({ variant, href, text }: Props) => {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      onClick={(e) => {
        e.preventDefault();
        router.push(href);
      }}
    >
      {text}
    </Button>
  );
};

export default NavigationButtonClientComponent;
