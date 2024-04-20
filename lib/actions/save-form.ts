"use server";

import { auth } from "@/auth";

import { db } from "../db";

export async function saveForm(formObject: any) {
  try {
    const session = await auth();

    if (!session || !session.user) return;

    const user = await db.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) return;

    // Step 1: Create Form
    const form = await db.form.create({
      data: {
        formTitle: formObject.title,
        sections: {
          // Step 2: Create Sections
          create: formObject.sections.map(
            (section: any, sectionIndex: number) => ({
              id: section.id,
              title: section.title,
              description: section.description,
              order: sectionIndex + 1, // Adding 1 to start order from 1
              questions: {
                // Step 3: Create Questions
                create: section.questions.map(
                  (question: any, questionIndex: number) => ({
                    id: question.id,
                    type: question.type,
                    content: question.content,
                    required: question.required,
                    order: questionIndex + 1, // Adding 1 to start order from 1
                    options: {
                      // Step 4: Create Options
                      create: question.options.map(
                        (option: any, optionIndex: number) => ({
                          id: option.id,
                          value: option.value,
                          order: optionIndex + 1, // Adding 1 to start order from 1
                        })
                      ),
                    },
                  })
                ),
              },
            })
          ),
        },
        userId: user.id,
      },
      // Include nested relations in the response
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
    return form;
  } catch (error) {
    console.error("Error saving form:", error);
    throw error;
  }
}
