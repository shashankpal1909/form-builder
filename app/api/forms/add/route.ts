import { auth } from "@/auth";
import { db } from "@/lib/db";

interface Option {
  id: string;
  order: number;
  value: string;
}

interface Question {
  id: string;
  order: number;
  type: string;
  content: string;
  options?: Option[];
  required: boolean;
  hasOtherOption: boolean;
}

interface Section {
  id: string;
  order: number;
  title: string;
  description: string;
  questions: Question[];
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user)
    return new Response(
      JSON.stringify({
        error: "not authenticated",
      })
    );

  if (!session.user.email)
    return new Response(
      JSON.stringify({
        error: "no email",
      })
    );

  const body = await req.json();

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || !user.id) {
    return new Response(
      JSON.stringify({
        error: "not authenticated",
      }),
      {
        status: 401,
      }
    );
  }

  console.log("body", body);

  const existingForm = await db.form.findUnique({
    where: { id: body.formObject.id },
    include: {
      sections: { include: { questions: { include: { options: true } } } },
    },
  });

  if (existingForm) {
    if (existingForm.userId !== user.id) {
      return new Response(
        JSON.stringify({
          error: "not authorized",
        }),
        {
          status: 401,
        }
      );
    }
  }

  const form = await saveForm(body.formObject, user.id);
  console.log(form);

  return new Response(JSON.stringify({ message: "success", form }));
}

async function saveForm(formData: any, userId: string) {
  formData = {
    id: formData.id,
    title: formData.title,
    sections: formData.sections.map((section: any, sectionIndex: number) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      order: sectionIndex + 1,
      questions: section.questions.map(
        (question: any, questionIndex: number) => ({
          id: question.id,
          order: questionIndex + 1,
          type: question.type,
          content: question.content,
          options: question.options.map((option: any, optionIndex: number) => ({
            id: option.id,
            order: optionIndex + 1,
            value: option.value,
          })),
          required: question.required,
        })
      ),
    })),
  };

  const existingForm = await db.form.findUnique({
    where: { id: formData.id },
    include: {
      sections: { include: { questions: { include: { options: true } } } },
    },
  });

  if (existingForm) {
    // Extract the IDs of questions that are present in the incoming form
    const incomingQuestionIds = formData.sections.flatMap((section: Section) =>
      section.questions.map((question: Question) => question.id)
    );
    const incomingOptionIds = formData.sections.flatMap((section: Section) =>
      section.questions.flatMap((question: Question) =>
        question.options
          ? question.options.map((option: Option) => option.id)
          : []
      )
    );

    // Iterate over each section, question, and option of the existing form
    for (const section of existingForm.sections) {
      for (const question of section.questions) {
        // If the question ID is not present in the incoming form, delete the question
        if (!incomingQuestionIds.includes(question.id)) {
          await db.option.deleteMany({ where: { questionId: question.id } });
          await db.answer.deleteMany({ where: { questionId: question.id } });
          await db.question.delete({ where: { id: question.id } });
        } else {
          // If the question exists, check for options to delete
          for (const option of question.options) {
            // If the option ID is not present in the incoming form, delete the option
            if (!incomingOptionIds.includes(option.id)) {
              await db.option.delete({ where: { id: option.id } });
            }
          }
        }
      }
    }
  }

  console.log("form-data", JSON.stringify(formData));

  const form = await db.form.upsert({
    where: { id: formData.id },
    update: {
      title: formData.title,
      sections: {
        upsert: formData.sections.map((section: Section) => ({
          where: { id: section.id },
          update: {
            title: section.title,
            order: section.order,
            description: section.description,
            questions: {
              upsert: section.questions.map((question: Question) => ({
                where: { id: question.id },
                update: {
                  type: question.type,
                  order: question.order,
                  content: question.content,
                  required: question.required,
                  // hasOtherOption: question.hasOtherOption,
                  options: {
                    upsert: question!.options!.map((option: Option) => ({
                      where: { id: option.id },
                      update: { order: option.order, value: option.value },
                      create: {
                        id: option.id,
                        order: option.order,
                        value: option.value,
                      },
                    })),
                  },
                },
                create: {
                  id: question.id,
                  type: question.type,
                  order: question.order,
                  content: question.content,
                  required: question.required,
                  // hasOtherOption: question.hasOtherOption,
                  options: {
                    create: question.options?.map((option: Option) => ({
                      id: option.id,
                      order: option.order,
                      value: option.value,
                    })),
                  },
                },
              })),
            },
          },
          create: {
            id: section.id,
            order: section.order,
            title: section.title,
            description: section.description,
            questions: {
              create: section.questions.map((question: Question) => ({
                id: question.id,
                order: question.order,
                type: question.type,
                content: question.content,
                required: question.required,
                // hasOtherOption: question.hasOtherOption,
                options: {
                  create: question.options?.map((option: Option) => ({
                    id: option.id,
                    order: option.order,
                    value: option.value,
                  })),
                },
              })),
            },
          },
        })),
      },
    },
    create: {
      id: formData.id,
      title: formData.title,
      userId,
      sections: {
        create: formData.sections.map((section: Section) => ({
          id: section.id,
          title: section.title,
          description: section.description,
          order: section.order,
          questions: {
            create: section.questions.map((question: Question) => ({
              id: question.id,
              order: question.order,
              type: question.type,
              content: question.content,
              required: question.required,
              // hasOtherOption: question.hasOtherOption,
              options: {
                create: question.options?.map((option: Option) => ({
                  id: option.id,
                  order: option.order,
                  value: option.value,
                })),
              },
            })),
          },
        })),
      },
    },
    include: {
      sections: { include: { questions: { include: { options: true } } } },
    },
  });

  return form;
}
