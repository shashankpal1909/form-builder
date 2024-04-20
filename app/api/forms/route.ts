import { auth } from "@/auth";
import { getFormsByUserEmail } from "@/data/form";

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

  const forms = await getFormsByUserEmail(session.user.email);

  return new Response(JSON.stringify({ forms, message: "success" }));
}
