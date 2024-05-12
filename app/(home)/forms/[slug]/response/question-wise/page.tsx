import React from "react";

import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getFormWithAllResponses } from "@/data/form";
import { getUserByEmail } from "@/data/user";

type Props = { params: { slug: string } };

const QuestionWiseResponsePage = async ({ params }: Props) => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return <div>Not authenticated</div>;
  }

  const user = await getUserByEmail(session.user.email);

  if (!user || !user.id) {
    return <div>Not authenticated</div>;
  }

  const form = await getFormWithAllResponses(params.slug);
  // console.log(JSON.stringify(form));

  if (!form) {
    return <div>Form not found</div>;
  }

  const questions: {
    [questionId: string]: {
      uniqueResponse?: string[];
      optionResponse?: {
        [optionId: string]: number;
      };
    };
  } = {};

  for (const section of form.sections) {
    for (const question of section.questions) {
      if (
        question.type === "short" ||
        question.type === "paragraph" ||
        question.type === "date"
      ) {
        const set = new Set<string>();
        for (const response of question.responses) {
          set.add(response.value);
        }
        set.delete("");
        questions[question.id] = {
          uniqueResponse: Array.from(set),
        };
      } else {
        const optionsResponseCount: { [optionId: string]: number } = {};

        for (const option of question.options) {
          optionsResponseCount[option.id] = 0;
        }

        for (const response of question.responses) {
          for (const option of response.options) {
            optionsResponseCount[option.id] += 1;
          }
        }
        questions[question.id] = {
          optionResponse: optionsResponseCount,
        };
      }
    }
  }

  if (!form) {
    return <div>Form/Response not found</div>;
  }

  if (form.userId !== user?.id) {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex flex-grow flex-col gap-2 container my-8">
      <div className="flex flex-col w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">{form.title}</h2>
        <Label className="text-muted-foreground">Question-Wise Responses</Label>
      </div>
      <Separator className="mt-6" />
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
                  {question.type === "short" ||
                  question.type === "paragraph" ||
                  question.type === "date" ? (
                    questions[question.id].uniqueResponse?.length ? (
                      questions[question.id].uniqueResponse?.map(
                        (val) => val && <Label key={val}>{val}</Label>
                      )
                    ) : (
                      <Label className="underline">No Responses</Label>
                    )
                  ) : (
                    question.options.map((option) => (
                      <Label key={option.id}>
                        {option.value} (
                        {questions[question.id].optionResponse?.[option.id]})
                      </Label>
                    ))
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionWiseResponsePage;
