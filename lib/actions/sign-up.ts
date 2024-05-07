"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SignUpSchema } from "@/schemas";

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

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    name,
    verificationToken.email,
    verificationToken.token
  );

  return { status: "success", message: "Verification email has been sent" };
};
