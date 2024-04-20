"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { IoShareSocial } from "react-icons/io5";
import { MdAdd, MdEdit } from "react-icons/md";

import LoadingComponent from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createEmptyForm } from "@/lib/actions/create-form";

const initialState = {
  error: "",
};

interface Form {
  id: string;
  formTitle: string;
  userId: string;
}

const FormsPage = () => {
  const [state, formAction] = useFormState(createEmptyForm, initialState);
  const { pending } = useFormStatus();
  const session = useSession();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<true | false>(true);
  const router = useRouter();

  if (
    !session ||
    !session.data ||
    !session.data.user ||
    !session.data.user.email
  ) {
    throw new Error("Unauthenticated");
  }

  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({ title: state.error });
      console.log("state", state);
    }
  }, [state, toast]);

  useEffect(() => {
    setLoading(true);
    const fetchForms = async () => {
      const response = await fetch(`/api/forms/`, {
        method: "POST",
      });
      const data = await response.json();
      console.log(data);

      setForms(data.forms);
      setLoading(false);
    };

    fetchForms();
  }, []);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col gap-2 container mt-8">
      <div className="flex items-center">
        <form
          action={formAction}
          className="flex w-full gap-2 flex-col justify-between items-center"
        >
          <div className="flex w-full justify-between items-center">
            <h1 className="text-2xl">Your Forms</h1>
            <Button aria-disabled={pending} type="submit">
              {pending ? (
                "Creating..."
              ) : (
                <>
                  <MdAdd className="h-[1.2rem] w-[1.2rem]" />
                  &nbsp;New Form
                </>
              )}
            </Button>
          </div>

          <div>{state?.error ? `An error occurred: ${state.error}` : null}</div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {forms.map((form) => {
          return (
            <Card key={form.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {form.formTitle}{" "}
                  <Button size={"icon"} variant={"outline"}>
                    <IoShareSocial />
                  </Button>
                </CardTitle>
                <CardDescription>{form.id}</CardDescription>
              </CardHeader>
              <CardContent>form desc</CardContent>
              <CardFooter className="flex gap-2 flex-col md:flex-row items-center justify-between">
                <div className="flex">
                  <Button variant="outline">
                    <GrView />
                    &nbsp;View Responses
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/forms/${form.id}/edit`)}
                  >
                    <MdEdit />
                    &nbsp;Edit
                  </Button>
                  <Button onClick={() => router.push(`/forms/${form.id}/`)}>
                    <FaExternalLinkAlt />
                    &nbsp;Open
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FormsPage;
