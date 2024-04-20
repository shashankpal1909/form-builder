import { db } from "@/lib/db";

import { getUserByEmail } from "./user";

export const getFormById = (id: string) => {
  return db.form.findUnique({
    where: { id },
    include: {
      sections: {
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });
};

export const getFormsByUserEmail = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user || !user.id) {
    return [];
  }

  console.log("user:", user);

  return db.form.findMany({
    where: {
      userId: user.id,
    },
  });
};
