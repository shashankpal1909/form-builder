import { auth } from "@/auth";
import { getFormById } from "@/data/form";

// TODO: change this route to GET
export async function POST(
  _req: Request,
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
  console.log(form);

  return new Response(JSON.stringify({ message: "success", form }));
}
