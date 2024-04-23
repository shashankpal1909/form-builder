import { auth } from "@/auth";
import { getFormById } from "@/data/form";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const session = await auth();
  const slug = params.slug;

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

  const form = await getFormById(slug);

  if (!form) {
    return new Response(
      JSON.stringify({
        error: "form not found",
      }),
      {
        status: 404,
      }
    );
  }

  const user = await getUserByEmail(session.user.email);

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

  const { formResponse } = await req.json();
  const response = await saveFormResponse(form.id, formResponse, user.id);

  if (!response) {
    return new Response(
      JSON.stringify({
        error: "failed to save response",
      }),
      {
        status: 500,
      }
    );
  }

  return new Response(JSON.stringify({ message: "success", response }));
}

const saveFormResponse = async (
  formId: string,
  formResponse: any,
  userId: string
) => {
  try {
    // Create a new Response entry
    const response = await db.response.create({
      data: {
        formId,
        userId,
        answers: {
          create: Object.keys(formResponse).map((questionId) => {
            const answer = formResponse[questionId];
            return {
              questionId: questionId,
              value: answer.value,
              options: {
                connect: answer.options.map((optionId: string) => ({
                  id: optionId,
                })),
              },
            };
          }),
        },
      },
      include: {
        answers: {
          include: {
            options: true,
          },
        },
      },
    });

    return response;
  } catch (error) {
    console.error("Error saving form response:", error);
  }
};
