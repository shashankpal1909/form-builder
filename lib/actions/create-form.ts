"use server";

import { auth } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { generateForm } from "@/lib/utils/ai_generation";

import { db } from "../db";

export const createNewForm = async (
  title: string,
  type: string,
  template?: string,
  prompt?: string
) => {
  console.log("create empty form");
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return {
      status: "error",
      message: "not authenticated",
    };
  }

  const user = await getUserByEmail(session.user.email);

  if (!user || !user.id) {
    return {
      status: "error",
      message: "not authenticated",
    };
  }

  let form = {
    title,
    userId: user.id,
    sections: [
      {
        title: "Untitled Section",
        description: "",
        questions: [
          {
            content: "Untitled Question",
            type: "short",
            required: false,
            options: [],
          },
        ],
      },
    ],
  };

  switch (type) {
    case "blank":
      break;
    case "from_template":
      break;
    case "ai_generated":
      if (prompt) {
        const generatedForm = await generateForm(prompt);
        if (generatedForm) {
          form.title = generatedForm.title;
          form.sections = generatedForm.sections;
        }
      }
      break;
  }

  try {
    const newForm = await db.form.create({
      data: {
        title: form.title,
        userId: form.userId,
        sections: {
          create: form.sections.map((section, index) => ({
            title: section.title,
            description: section.description,
            order: index + 1,
            questions: {
              create: section.questions.map((question, index) => ({
                content: question.content,
                type: question.type,
                required: question.required,
                order: index + 1,
                options: {
                  create: question.options
                    ? question.options.map(
                        (option: { value: string }, index) => ({
                          value: option.value,
                          order: index + 1,
                        })
                      )
                    : [],
                },
              })),
            },
          })),
        },
      },
    });
    return {
      status: "success",
      message: "form created",
      data: newForm,
    };
  } catch (error: any) {
    console.log("error", error);
    return {
      status: "error",
      message: error.message,
    };
  }
};
