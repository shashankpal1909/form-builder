"use client";

import { useRouter } from "next/navigation";
import React from "react";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LandingPage: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-grow justify-center items-center">
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center justify-center max-w-7xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
              Welcome to FormBuilderPro
            </h1>
            <Label className="text-lg md:text-xl text-center mb-8">
              The ultimate solution for creating customizable forms for your
              website.
            </Label>
            <div className="flex gap-4 justify-center mb-8">
              <Button
                className="rounded-full"
                size={"lg"}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/sign-up");
                }}
              >
                Get Started
              </Button>
              <Button
                size={"lg"}
                className="rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/pricing");
                }}
              >
                Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
