"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { IoShareSocial } from "react-icons/io5";
import { MdAdd, MdContentCopy, MdEdit } from "react-icons/md";

import NewFormDialog from "@/components/form/new-form";
import LoadingComponent from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createNewForm } from "@/lib/actions/create-form";

const initialState = {
  error: "",
};

interface Form {
  id: string;
  title: string;
  userId: string;
}

const FormsPage = () => {
  const session = useSession();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<true | false>(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [newFormTitle, setNewFormTitle] = useState<string>("Untitled Form");
  const [newFormType, setNewFormType] = useState<
    "blank" | "from_template" | "ai_generated"
  >("blank");
  const [newFormPrompt, setNewFormPrompt] = useState<string>("");

  const handleCreateNewForm = (e: React.MouseEvent) => {
    startTransition(() => {
      createNewForm(newFormTitle, newFormType, "", newFormPrompt)
        .then((res) => {
          if (res.status === "error") {
            toast({
              title: `An error occurred!, ${res.message}`,
              variant: "destructive",
            });
          }
          setNewFormTitle("Untitled Form");
          setNewFormType("blank");
          setNewFormPrompt("");
        })
        .catch((error) => {
          toast({
            title: `An error occurred!, ${error?.message}`,
            variant: "destructive",
          });
        });
    });
  };

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
    <div className="flex flex-grow flex-col gap-2 container my-8">
      <div className="flex items-center">
        <div className="flex w-full gap-2 flex-col justify-between items-center">
          <div className="flex w-full space-y-0.5 justify-between items-center">
            <div className="flex flex-col gap-2 justify-center items-center">
              <h2 className="text-2xl font-bold tracking-tight">Your Forms</h2>
              <Label className="text-muted-foreground">Manage your forms</Label>
            </div>
            <NewFormDialog>
              <Button>
                <MdAdd className="h-[1.2rem] w-[1.2rem]" />
                &nbsp;New Form
              </Button>
            </NewFormDialog>
          </div>
          <Separator className="my-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {forms.map((form) => {
          return (
            <Card key={form.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {form.title}
                  <Popover>
                    <PopoverTrigger>
                      <Button size={"icon"} variant={"outline"}>
                        <IoShareSocial />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-min" asChild>
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          navigator.clipboard
                            .writeText(
                              `${process.env.NEXT_PUBLIC_APP_URL}/forms/${form.id}`
                            )
                            .then((r) =>
                              toast({
                                title: "Link copied to clipboard",
                              })
                            )
                            .catch((e) =>
                              toast({
                                title: "An Error Occured",
                                variant: "destructive",
                              })
                            );
                        }}
                      >
                        <MdContentCopy />
                        &nbsp;Copy Link
                      </Button>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
                <CardDescription>{form.id}</CardDescription>
              </CardHeader>
              <Separator />
              <CardFooter className="flex gap-2 py-4 flex-col md:flex-row items-center justify-between">
                <div className="flex">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/forms/${form.id}/response`);
                    }}
                  >
                    <GrView />
                    &nbsp;View Responses
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size={"icon"}
                    onClick={() => router.push(`/forms/${form.id}/edit`)}
                  >
                    <MdEdit />
                  </Button>
                  <Button
                    size={"icon"}
                    variant="outline"
                    onClick={() => router.push(`/forms/${form.id}/`)}
                  >
                    <FaExternalLinkAlt />
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
