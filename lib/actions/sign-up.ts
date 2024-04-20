"use server"

import bcrypt from "bcryptjs";
import { z } from "zod";

import { getUserByEmail } from "@/data/user";
import { SignUpSchema } from "@/schemas";

import { db } from "../db";

export const signUpServerAction = async (
  values: z.infer<typeof SignUpSchema>
) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { status: "error", message: "Email already in use!" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { status: "success", message: "Sign up success!" };
};
