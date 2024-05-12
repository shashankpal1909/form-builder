"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CiCircleAlert } from "react-icons/ci";

import LoadingComponent from "@/components/loading";
import {
    AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Form as FormSchema, Section } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { AlertDialog } from "@radix-ui/react-alert-dialog";

type Props = { params: { slug: string } };

type FormResponse = {
  [questionId: string]: {
    value: string;
    options: string[];
  };
};

const ViewFormComponent = ({ params }: Props) => {
  const { slug } = params;
  const [formObject, setFormObject] = useState<FormSchema>({
    id: slug,
    title: "",
    sections: [],
  });
  const [loading, setLoading] = useState<true | false>(true);

  const [formResponse, setFormResponse] = useState<FormResponse>({});
  const [errors, setErrors] = useState<{
    [questionId: string]: string;
  }>({});

  const [sectionIndex, setSectionIndex] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<Section>();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // todo: check for required fields before moving to the next section or submit

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);

      const response = await fetch(`/api/forms/${slug}`, {
        method: "POST",
      });
      const data = await response.json();

      console.log("fetched form:", data);

      setFormObject(data.form);

      if (data.form.sections.length > 0) {
        setCurrentSection(data.form.sections[0]);
        setSectionIndex(0);

        // load any responses if available
        const response: FormResponse = {};

        for (const section of data.form.sections) {
          for (const question of section.questions) {
            response[question.id] = {
              value: "",
              options: [],
            };
          }
        }

        setFormResponse(response);

        console.log(currentSection);
        console.log("------------------------");
      }

      setLoading(false);
    };
    fetchForm();
  }, [slug]);

  useEffect(() => {
    console.log("formResponse", formResponse);
  }, [formResponse]);

  useEffect(() => {
    console.log("sectionIndex", sectionIndex);
  }, [sectionIndex]);

  useEffect(() => {
    console.log("currentSection", currentSection);
  }, [currentSection]);

  const clearFormResponse = () => {
    const response: FormResponse = {};

    for (const section of formObject.sections) {
      for (const question of section.questions) {
        response[question.id] = {
          value: "",
          options: [],
        };
      }
    }

    setFormResponse(response);
    setErrors({});
  };

  const validateRequiredQuestionsResponse = () => {
    let isResponseValid = true;
    if (currentSection) {
      for (const question of currentSection?.questions) {
        if (question.required) {
          if (
            question.type === "short" ||
            question.type === "paragraph" ||
            question.type === "date"
          ) {
            if (formResponse[question.id]?.value === "") {
              setErrors((prev) => ({
                ...prev,
                [question.id]: "This question is required",
              }));
              isResponseValid = false;
            }
          } else {
            if (formResponse[question.id]?.options.length === 0) {
              setErrors((prev) => ({
                ...prev,
                [question.id]: "This question is required",
              }));
              isResponseValid = false;
            }
          }
        }
      }
    }

    if (!isResponseValid) {
      toast({
        variant: "destructive",
        title: "Please answer all the required questions!",
        duration: 2000,
      });
    }

    return isResponseValid;
  };
  const [isResponseSubmitting, setIsResponseSubmitting] = useState(false);

  if (loading) {
    return <LoadingComponent />;
  }

  const handleResponseSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (validateRequiredQuestionsResponse()) {
      setIsResponseSubmitting(true);

      const response = await fetch(`/api/forms/${slug}/response`, {
        method: "POST",
        body: JSON.stringify({ formResponse }),
      });

      if (response.status === 200) {
        setIsFormSubmitted(true);
        clearFormResponse();
        setSectionIndex(0);
        setCurrentSection(formObject.sections[0]);
      } else {
        // show toast error
        toast({
          variant: "destructive",
          title: "There was an error submitting your response!",
          duration: 2000,
        });
      }

      setIsResponseSubmitting(false);
    }
  };

  return (
    <div className="flex flex-grow flex-col gap-2 container my-8">
      <div className="flex flex-col w-full space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {formObject.title}
        </h2>
      </div>
      <Separator className="my-6" />
      {!isFormSubmitted ? (
        <form>
          {currentSection && (
            <div className="flex flex-col gap-4">
              <Card className="flex flex-col gap">
                <CardHeader>
                  <CardTitle className="flex gap-2 text-2xl justify-start items-center">
                    {currentSection.title}
                  </CardTitle>
                  {currentSection.description && (
                    <>
                      <CardDescription>
                        {currentSection.description}
                      </CardDescription>
                    </>
                  )}
                </CardHeader>
                <Separator />
                <CardFooter className="flex text-sm justify-start py-4 gap-4 text-red-600 dark:text-red-500">
                  * indicates required questions
                </CardFooter>
              </Card>
              <div className="flex flex-col gap-2">
                {currentSection.questions.map((question) => (
                  <Card
                    key={question.id}
                    className="h-min flex flex-col w-full"
                  >
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

                    <CardContent className="flex flex-col justify-end p-4 gap-4">
                      {question.type === "short" && (
                        <Input
                          required={question.required}
                          value={formResponse[question.id].value}
                          onChange={(e) => {
                            setErrors(
                              // remove error messages
                              (prev) => {
                                return {
                                  ...prev,
                                  [question.id]: "",
                                };
                              }
                            );

                            setFormResponse((prev) => {
                              return {
                                ...prev,
                                [question.id]: {
                                  value: e.target.value,
                                  options: [],
                                },
                              };
                            });
                          }}
                        />
                      )}

                      {question.type === "paragraph" && (
                        <Textarea
                          value={formResponse[question.id].value}
                          onChange={(e) => {
                            setErrors(
                              // remove error messages
                              (prev) => {
                                return {
                                  ...prev,
                                  [question.id]: "",
                                };
                              }
                            );
                            setFormResponse((prev) => {
                              return {
                                ...prev,
                                [question.id]: {
                                  value: e.target.value,
                                  options: [],
                                },
                              };
                            });
                          }}
                          required={question.required}
                        />
                      )}

                      {question.type === "date" && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !formResponse[question.id].value &&
                                  "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {formResponse[question.id].value ? (
                                format(formResponse[question.id].value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                new Date(formResponse[question.id].value)
                              }
                              onSelect={(date) => {
                                setErrors(
                                  // remove error messages
                                  (prev) => {
                                    return {
                                      ...prev,
                                      [question.id]: "",
                                    };
                                  }
                                );
                                setFormResponse((prev) => {
                                  return {
                                    ...prev,
                                    [question.id]: {
                                      value: date ? date.toISOString() : "",
                                      options: [],
                                    },
                                  };
                                });
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}

                      {question.type === "radio" && (
                        <RadioGroup
                          className="flex flex-col gap-4"
                          defaultValue="option-one"
                          required={question.required}
                        >
                          {question.options &&
                            question.options.map((option) => (
                              <div
                                key={option.id}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={option.id}
                                  id={option.id}
                                  checked={
                                    !!formResponse[question.id].options.find(
                                      (id) => id === option.id
                                    )
                                  }
                                  onClick={() => {
                                    setErrors(
                                      // remove error messages
                                      (prev) => {
                                        return {
                                          ...prev,
                                          [question.id]: "",
                                        };
                                      }
                                    );
                                    setFormResponse((prev) => {
                                      return {
                                        ...prev,
                                        [question.id]: {
                                          value: "",
                                          options: [option.id],
                                        },
                                      };
                                    });
                                  }}
                                />
                                <Label htmlFor={option.id}>
                                  {option.value}
                                </Label>
                              </div>
                            ))}
                        </RadioGroup>
                      )}

                      {question.type === "check" &&
                        question.options &&
                        question.options.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={
                                !!formResponse[question.id].options.find(
                                  (id) => id === option.id
                                )
                              }
                              onClick={() => {
                                setErrors(
                                  // remove error messages
                                  (prev) => {
                                    return {
                                      ...prev,
                                      [question.id]: "",
                                    };
                                  }
                                );
                                if (
                                  formResponse[question.id] &&
                                  formResponse[question.id].options.find(
                                    (elem) => elem === option.id
                                  )
                                ) {
                                  setFormResponse((prev) => {
                                    return {
                                      ...prev,
                                      [question.id]: {
                                        value: "",
                                        options: formResponse[
                                          question.id
                                        ].options.filter(
                                          (id) => id !== option.id
                                        ),
                                      },
                                    };
                                  });
                                } else {
                                  setFormResponse((prev) => {
                                    return {
                                      ...prev,
                                      [question.id]: {
                                        value: "",
                                        options: [
                                          ...(formResponse[question.id]
                                            ? formResponse[question.id].options
                                            : []),
                                          option.id,
                                        ],
                                      },
                                    };
                                  });
                                }
                              }}
                              value={option.id}
                              id={option.id}
                            />
                            <Label htmlFor={option.id}>{option.value}</Label>
                          </div>
                        ))}

                      {question.type === "dropdown" && (
                        <Select
                          onValueChange={(id) => {
                            setErrors(
                              // remove error messages
                              (prev) => {
                                return {
                                  ...prev,
                                  [question.id]: "",
                                };
                              }
                            );
                            setFormResponse((prev) => {
                              return {
                                ...prev,
                                [question.id]: {
                                  value: "",
                                  options: [id],
                                },
                              };
                            });
                          }}
                          required={question.required}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {question.options &&
                              question.options.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  {option.value}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}

                      {errors[question.id] && (
                        <span className="flex text-red-600 dark:text-red-500 text-sm">
                          <CiCircleAlert size={18} />
                          &nbsp;{errors[question.id]}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex mt-8 gap-2 justify-between items-center">
            <div className="flex gap-2">
              {sectionIndex !== 0 && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setSectionIndex((prev) => {
                      setCurrentSection(formObject.sections[prev - 1]);
                      return prev - 1;
                    });
                  }}
                  variant={"outline"}
                >
                  Back
                </Button>
              )}
              {sectionIndex === formObject.sections.length - 1 ? (
                <Button onClick={handleResponseSubmit}>Submit</Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (validateRequiredQuestionsResponse()) {
                      setSectionIndex((prev) => {
                        setCurrentSection(formObject.sections[prev + 1]);
                        return prev + 1;
                      });
                    }
                  }}
                  disabled={sectionIndex === formObject.sections.length - 1}
                  variant={"outline"}
                >
                  Next
                </Button>
              )}
            </div>

            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"ghost"}>Clear form</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        clearFormResponse();
                        setSectionIndex(0);
                        setCurrentSection(formObject.sections[0]);
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-grow flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-center  text-gray-900 dark:text-gray-100">
            Your response has been recorded!
          </h1>
          <Button
            variant={"link"}
            onClick={(e) => {
              e.preventDefault();
              setIsFormSubmitted(false);
            }}
          >
            Submit another response
          </Button>
        </div>
      )}
    </div>
  );
};

export default ViewFormComponent;
