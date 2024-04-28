"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { MdError, MdVerified } from "react-icons/md";

import InfoComponent from "@/components/info";
import LoadingComponent from "@/components/loading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { newVerification } from "@/lib/actions/new-verification";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

type Props = {};

const VerifyPage = (props: Props) => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-[600px] mx-4">
        <CardHeader>
          <CardTitle className="text-3xl">Email Verification</CardTitle>
          <CardDescription className="text-wrap">
            Lets verify your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!success && !error && <LoadingComponent />}
          {error && (
            <InfoComponent
              variant={"error"}
              title={"Error"}
              description={error}
              Icon={MdError}
            />
          )}
          {success && (
            <InfoComponent
              variant={"success"}
              title={"Success"}
              description={success}
              Icon={MdVerified}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col w-full">
          <div className="text-sm">
            <Link href="/sign-in" className="underline">
              Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyPage;
