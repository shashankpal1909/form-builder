import { db } from "@/lib/db";

import { getUserByEmail } from "./user";

export const getSubscriptionByEmail = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  return db.subscription.findUnique({
    where: { userId: user.id },
  });
};
