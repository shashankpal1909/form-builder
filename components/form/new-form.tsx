import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createNewForm } from "@/lib/actions/create-form";

type Props = {};

const NewFormDialog = ({ children }: PropsWithChildren<Props>) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newFormTitle, setNewFormTitle] = useState<string>("Untitled Form");
  const [newFormType, setNewFormType] = useState<
    "blank" | "from_template" | "ai_generated"
  >("blank");
  const [newFormPrompt, setNewFormPrompt] = useState<string>("");

  const handleCreateNewForm = (e: React.MouseEvent) => {
    startTransition(() => {
      createNewForm(newFormTitle, newFormType, "", newFormPrompt)
        .then((res) => {
          if (res.status === "success") {
            const form = res.data;
            if (form) {
              router.push(`/forms/${form.id}/edit`);
            }
          }
          if (res.status === "error") {
            toast({
              title: `An error occurred!, ${res.message}`,
              variant: "destructive",
            });
            setNewFormTitle("Untitled Form");
            setNewFormType("blank");
            setNewFormPrompt("");
          }
        })
        .catch((error) => {
          toast({
            title: `An error occurred!, ${error?.message}`,
            variant: "destructive",
          });
        });
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>New Form</DialogTitle>
          <DialogDescription>Create new form</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newFormTitle}
              onChange={(e) => setNewFormTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Choose Template
            </Label>
            <RadioGroup className="col-span-3" value={newFormType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="blank"
                  onClick={(e) => setNewFormType(e.target.value)}
                  id="r1"
                />
                <Label htmlFor="r1">Blank Form</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="from_template"
                  onClick={(e) => setNewFormType(e.target.value)}
                  id="r2"
                />
                <Label htmlFor="r2">From Template</Label>
              </div>
              {newFormType === "from_template" && (
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="template1">Template 1</SelectItem>
                      <SelectItem value="template2">Template 2</SelectItem>
                      <SelectItem value="template3">Template 3</SelectItem>
                      <SelectItem value="template4">Template 4</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="ai_generated"
                  onClick={(e) => setNewFormType(e.target.value)}
                  id="r3"
                />
                <Label htmlFor="r3">AI Generated</Label>
              </div>
              {newFormType === "ai_generated" && (
                <Textarea
                  placeholder="Enter your prompt describing your form."
                  value={newFormPrompt}
                  onChange={(e) => setNewFormPrompt(e.target.value)}
                />
              )}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={handleCreateNewForm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewFormDialog;
