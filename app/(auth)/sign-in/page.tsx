"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const signInWithGoogle = () => {
    signIn("google", {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-[600px] mx-4">
        <CardHeader>
          <CardTitle className="text-3xl">Sign In</CardTitle>
          <CardDescription>
            Welcome back! Please enter your details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid w-full gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Your email address" />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm underline">
                Forgot Password?
              </Link>
            </div>
            <div className="flex flex-col space-y-2">
              <Button>Continue</Button>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  signInWithGoogle();
                }}
              >
                Continue With Google
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col w-full">
          <div className="text-sm">
            Don&apos;t have an account?&nbsp;
            <Link href="/sign-up" className="underline">
              Register here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignInPage;
