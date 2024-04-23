"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Label } from "@radix-ui/react-dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

type Props = {
  response: {
    id: string;
    formId: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      email: string;
      emailVerified: Date | null;
      image: string | null;
      password: string | null;
      createdAt: Date;
      updatedAt: Date;
    } | null;
  };
};

const ResponseCard = ({ response }: Props) => {
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={response.user?.image} />
                <AvatarFallback>
                  {response.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Label>{response.user?.name}</Label>
            </div>
          </div>
          <div className="flex gap-2">
          <Button
            variant={"outline"}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/forms/${response.formId}/response/${response.id}`);
            }}
          >
            View
          </Button>
          <Button variant={"outline"}>Delete</Button>
          </div>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="flex py-4 justify-between">
        <CardDescription>{response.id}</CardDescription>
        <CardDescription>{response.createdAt.toLocaleString()}</CardDescription>
      </CardFooter>
    </Card>
  );
};

export default ResponseCard;
