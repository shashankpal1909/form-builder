"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const NotFoundPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex flex-grow flex-col justify-center items-center">
      <h1 className="text-4xl font-bold  mb-4">404 - Not Found</h1>
      <Label className="text-lg  mb-8">
        Oops! It seems the page you&apos;re looking for doesn&apos;t exist.
      </Label>
      <Button
        onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}
        size={"lg"}
        className="rounded-full"
      >
        Back to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
