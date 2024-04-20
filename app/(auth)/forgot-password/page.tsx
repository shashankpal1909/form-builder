import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ForgotPasswordPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-[600px] mx-4">
        <CardHeader>
          <CardTitle className="text-3xl">Forgot Password</CardTitle>
          <CardDescription className="text-wrap">
            Enter your email and we&apos;ll send you instructions to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input id="name" placeholder="Your email address" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Button>Continue</Button>
              </div>
            </div>
          </form>
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
}

export default ForgotPasswordPage;
