import React from "react";

import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getFormWithResponseById, getResponseById } from "@/data/form";
import { getUserByEmail } from "@/data/user";

type Props = { params: { slug: string; responseId: string } };

const FormResponseByUserPage = async ({ params }: Props) => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return <div>Not authenticated</div>;
  }

  const user = await getUserByEmail(session.user.email);

  if (!user || !user.id) {
    return <div>Not authenticated</div>;
  }

  const form = await getFormWithResponseById(params.slug, params.responseId);
  const response = await getResponseById(params.responseId);

  if (!form || !response) {
    return <div>Form/Response not found</div>;
  }

  if (form.userId !== user?.id) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="container flex flex-col gap-2 py-8">
      <div className="flex flex-col gap-4">
        <Label className="text-3xl">{form.title}</Label>
        <Separator />
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={
                response.user && response.user.image
                  ? response.user.image
                  : undefined
              }
            />
            <AvatarFallback>
              {response.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Label>
            {response.user?.name} | {response.createdAt.toLocaleString()}
          </Label>
        </div>
      </div>
      {form.sections.map((section, index) => (
        <div key={section.id} className="flex flex-col gap-4">
          <Label className="text-2xl pt-4">
            Section {index + 1} of {form.sections.length}
          </Label>
          <Card className="flex flex-col gap">
            <CardHeader>
              <CardTitle className="flex gap-2 text-2xl justify-start items-center">
                {section.title}
              </CardTitle>
            </CardHeader>
          </Card>
          <div className="flex flex-col gap-2">
            {section.questions.map((question) => (
              <Card key={question.id} className="h-min flex flex-col w-full">
                <CardHeader>
                  <CardTitle className="flex gap-2 justify-start items-center">
                    {question.content}
                    {question.required && (
                      <span className="text-red-600 dark:text-red-500">
                        &nbsp;*
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <Separator />

                <CardContent className="flex flex-col justify-end px-6 py-4 gap-4">
                  {question.responses.map((response) => (
                    <div key={response.id}>
                      {!!response.value || !!response.options.length ? (
                        <div className="flex flex-col gap-2">
                          <Label>{response.value}</Label>
                          {response.options.map((option) => (
                            <Label key={option.id}>{option.value}</Label>
                          ))}
                        </div>
                      ) : (
                        <Label className="underline">Not Answered</Label>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormResponseByUserPage;
