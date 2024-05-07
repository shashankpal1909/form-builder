"use client";

import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Return() {
  const router = useRouter();

  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    return (
      <div className="flex flex-col gap-4 flex-grow justify-center items-center">
        <h1 className="text-2xl font-bold">Purchase Successful</h1>
        <Label className="text-center">
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email us at&nbsp;
          <Link href="mailto:formbuilderpro@gmail.com">
            formbuilderpro@gmail.com
          </Link>
          .
        </Label>
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

  return null;
}
