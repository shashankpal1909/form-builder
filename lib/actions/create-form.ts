"use server";

import { redirect } from "next/navigation";
import { v4 as uuid } from "uuid";

import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";

import { db } from "../db";

export const createEmptyForm = async (prevState: any, formData: FormData) => {
  console.log("create empty form");
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return {
      error: "not authenticated",
    };
  }

  const user = await getUserByEmail(session.user.email);

  if (!user || !user.id) {
    return {
      error: "not authenticated",
    };
  }

  const formId = uuid();

  try {
    await db.form.create({
      data: {
        id: formId,
        title: "Untitled Form",
        userId: user.id,
        sections: {
          create: [
            {
              id: uuid(),
              order: 1,
              title: "Section 1",
              description: "",
              questions: {
                create: [
                  {
                    id: uuid(),
                    order: 1,
                    content: "Question 1",
                    type: "short",
                    required: false,
                  },
                ],
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    console.log(error);

    return {
      error: "Something went wrong",
    };
  } finally {
    redirect(`/forms/${formId}/edit`);
  }
};
