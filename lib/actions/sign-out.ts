"use server";

import { signOut } from "@/auth";

export const signOutServerAction = async () => {
  await signOut();
};
