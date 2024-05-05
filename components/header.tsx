"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { CgOptions } from "react-icons/cg";
import { CiCreditCard1, CiSettings } from "react-icons/ci";
import { FaUser, FaUsers } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { IoMdLogIn } from "react-icons/io";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { signOutServerAction } from "@/lib/actions/sign-out";
import { PlusIcon } from "@radix-ui/react-icons";

import { ModeToggle } from "./mode-toggle";

const Header = () => {
  const session = useSession();
  const router = useRouter();
  const user = session.data?.user;

  const signOutHandler = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
    signOutServerAction();
    // router.push("/sign-in");
  };

  const signInHandler = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => {
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
          <ModeToggle />
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size={"icon"}>
                    <CgOptions />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Forms</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/forms")}>
                      <FaUsers className="mr-2 h-4 w-4" />
                      <span>My Forms</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      <span>New Form</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <FaUser className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/billing")}>
                      <CiCreditCard1 className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CiSettings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOutHandler}>
                    <FiLogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="outline" size="default" onClick={signInHandler}>
              <IoMdLogIn size={16} />
              &nbsp;Sign In
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
