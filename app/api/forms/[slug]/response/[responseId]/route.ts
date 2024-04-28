import { auth } from "@/auth";
import { deleteResponseById, getFormById } from "@/data/form";
import { getUserByEmail } from "@/data/user";

export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string; responseId: string } }
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

  try {
    await deleteResponseById(params.responseId);
    return new Response(JSON.stringify({ message: "success" }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
