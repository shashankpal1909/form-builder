import { db } from "@/lib/db";

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    console.log("user provided token", token);
    

    const verificationToken = await db.verificationToken.findUnique({
      where: { token }
    });

    return verificationToken;
  } catch(error) {
    console.log("error occurred:", error);
    return null;

  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email }
    });

    return verificationToken;
  } catch {
    return null;
  }
}