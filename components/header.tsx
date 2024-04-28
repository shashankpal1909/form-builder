"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { signOutServerAction } from "@/lib/actions/sign-out";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const Header = () => {
  const session = useSession();
  const router = useRouter();
  const user = session.data?.user;

  const signOutHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signOutServerAction();
    // router.push("/sign-in");
  };

  const signInHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/sign-in");
  };

  return (
    <header className="bg-opacity-20 backdrop-filter backdrop-blur-lg border-b border-gray-300 dark:border-gray-700">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center py-4">
        <div className="flex items-center flex-shrink-0 mr-6">
          <Link href={"/"}>
            <h1 className="text-2xl font-semibold">FormBuilderPro</h1>
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          {user ? (
            // <TooltipProvider>
            // <Tooltip>
            // <TooltipTrigger>
            <>
              <Button variant={"outline"} onClick={() => router.push("/forms")}>
                My Forms
              </Button>
              <Button variant="outline" size="default" onClick={signOutHandler}>
                <IoMdLogOut size={16} />
                &nbsp;Sign Out
              </Button>
            </>
          ) : (
            // </TooltipTrigger>
            // <TooltipContent>Sign Out</TooltipContent>
            // </Tooltip>
            // </TooltipProvider>
            // <TooltipProvider>
            // <Tooltip>
            // <TooltipTrigger>
            <Button variant="outline" size="default" onClick={signInHandler}>
              <IoMdLogIn size={16} />
              &nbsp;Sign In
            </Button>
            // </TooltipTrigger>
            // <TooltipContent>Sign In</TooltipContent>
            // </Tooltip>
            // </TooltipProvider>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
