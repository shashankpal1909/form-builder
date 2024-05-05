import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getSubscriptionByEmail } from "@/data/subscription";

export const GET = async () => {
  const session = await auth();

  if (!session || !session.user)
    return new NextResponse(
      JSON.stringify({
        error: "not authenticated",
      }),
      { status: 401 }
    );

  if (!session.user.email)
    return new Response(
      JSON.stringify({
        error: "no email",
      }),
      { status: 401 }
    );

  const subscription = await getSubscriptionByEmail(session.user.email);

  return new NextResponse(
    JSON.stringify({
      subscription,
    }),
    { status: 200 }
  );
};
