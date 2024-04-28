import React from "react";

import { auth } from "@/auth";
import NavigationButtonClientComponent from "@/components/button-client";
import ResponseCard from "@/components/response/response-card";
import { getALlResponsesForForm, getFormWithAllResponsesByUser } from "@/data/form";
import { getUserByEmail } from "@/data/user";

type Props = { params: { slug: string } };

const FormResponsesPage = async ({ params }: Props) => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return <div>Not authenticated</div>;
  }

  const user = await getUserByEmail(session.user.email);

  if (!user || !user.id) {
    return <div>Not authenticated</div>;
  }

  const form = await getFormWithAllResponsesByUser(params.slug, user.id);

  if (!form) {
    return <div>Form not found</div>;
  }

  if (form.userId !== user?.id) {
    return <div>Unauthorized</div>;
  }

  const responses = await getALlResponsesForForm(params.slug);

  return (
    <div className="container flex flex-col gap-4 py-8">
      <div className="flex justify-between">
        <h1 className="text-2xl">Form Responses</h1>
        <NavigationButtonClientComponent
          variant={"default"}
          href={`/forms/${form.id}/response/question-wise`}
          text="View Question Wise Responses"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {responses.map((response) => {
          return <ResponseCard key={response.id} response={response} />;
        })}
      </div>
    </div>
  );
};

export default FormResponsesPage;
