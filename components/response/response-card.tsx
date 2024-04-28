"use client";

import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { MdDeleteOutline } from "react-icons/md";

import { Label } from "@radix-ui/react-dropdown-menu";

import ConfirmDialog from "../confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";

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
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const handleDeleteResponse = async function (): Promise<void> {
    setIsFetching(true);
    const res = await fetch(
      `/api/forms/${response.formId}/response/${response.id}`,
      { method: "DELETE" }
    );
    setIsFetching(false);

    if (res.status === 200) {
      console.log("response deleted", response.id);
      toast({
        title: "Response deleted",
        description: "The response has been deleted.",
        variant: "default",
      });
      startTransition(() => {
        router.refresh();
      });
    } else {
      console.log("error deleting response", response.id);
      toast({
        title: "Error deleting response",
        description: "There was an error deleting the response.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={isFetching || isPending ? "opacity-50" : ""}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={
                    response.user && response.user.image
                      ? response.user.image
                      : undefined
                  }
                />
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
                router.push(
                  `/forms/${response.formId}/response/${response.id}`
                );
              }}
            >
              View
            </Button>

            <ConfirmDialog
              title={"Are you sure?"}
              description="This action can't be undone."
              onClick={handleDeleteResponse}
            >
              <Button size={"icon"} variant={"outline"}>
                <MdDeleteOutline className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </ConfirmDialog>
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
