"use client";

import { Session } from "inspector";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdRadioButtonOff } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import {
    MdAdd, MdContentCopy, MdDeleteOutline, MdOutlineCheckBoxOutlineBlank
} from "react-icons/md";
import { PiRadioButtonLight } from "react-icons/pi";
import { TiDeleteOutline } from "react-icons/ti";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";

type Section = {
  id: string;
};

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "title must be at least 2 characters.",
  }),
  formDescription: z.string().optional(),
});
export default function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      formDescription: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const [sections, setSections] = useState<Section[]>([
    {
      id: uuidv4(),
    },
  ]);

  return (
    <div className="container h-screen mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between py-4 gap-4">
      {sections.map((section) => (
        <div key={section.id} className="flex gap-2 flex-col w-full">
          <Section key={section.id} />
          <Separator />
        </div>
      ))}
      <div className="flex">
        <Button
          size={"default"}
          variant={"outline"}
          onClick={() => {
            setSections((prev) => [
              ...prev,
              {
                id: uuidv4(),
              },
            ]);
          }}
        >
          <MdAdd className="h-[1.2rem] w-[1.2rem]" />
          &nbsp;Add Section
        </Button>
      </div>
    </div>
  );
}

type Question = {
  id: string;
  type: "short" | "paragraph" | "check" | "radio" | "dropdown";
};

const Section = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: uuidv4(),
      type: "short",
    },
  ]);

  return (
    <div className="flex flex-col w-full gap-2">
      {questions.map((question) => (
        <Card key={question.id} className="h-min flex flex-col w-full">
          <CardHeader>
            <CardTitle className="flex gap-2 justify-center items-center">
              <Input placeholder="enter your question" />
              <Select
                defaultValue="short"
                onValueChange={(
                  value: "short" | "paragraph" | "check" | "radio" | "dropdown"
                ) => {
                  setQuestions((prev) =>
                    prev.map((q) =>
                      q.id === question.id ? { ...q, type: value } : q
                    )
                  );
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short Answer</SelectItem>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                  <DropdownMenuSeparator />
                  <SelectItem value="radio">Multiple choice</SelectItem>
                  <SelectItem value="check">Checkboxes</SelectItem>
                  <SelectItem value="dropdown">Dropdown</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col justify-end p-4 gap-4">
            {question.type === "short" && <ShortAnswer />}
            {question.type === "paragraph" && <ParagraphAnswer />}
            {(question.type === "check" ||
              question.type === "radio" ||
              question.type === "dropdown") && <Options type={question.type} />}
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-end p-4 gap-2">
            <Button size={"icon"} variant={"outline"} onClick={() => {
              // code to make copy for current question
              
            }} >
              <MdContentCopy className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => {
                setQuestions((prev) =>
                  prev.filter((q) => q.id !== question.id)
                );
              }}
            >
              <MdDeleteOutline className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <Separator orientation="vertical" />
            <div className="flex justify-center items-center gap-1">
              <Label>Required?</Label>
              <Switch />
            </div>
          </CardFooter>
        </Card>
      ))}
      <div className="flex">
        <Button
          size={"default"}
          variant={"outline"}
          onClick={() => {
            setQuestions((prev) => [
              ...prev,
              {
                id: uuidv4(),
                type: "short",
              },
            ]);
          }}
        >
          <MdAdd className="h-[1.2rem] w-[1.2rem]" />
          &nbsp;Add Question
        </Button>
      </div>
    </div>
  );
};

const ShortAnswer = () => {
  return <Input readOnly />;
};

const ParagraphAnswer = () => {
  return <Textarea readOnly />;
};

type OptionsPropType = {
  type: "radio" | "check" | "dropdown";
};

type Option = {
  id: string;
  value: string;
};

const Options = ({ type }: OptionsPropType) => {
  const [options, setOptions] = useState<Option[]>([
    {
      id: uuidv4(),
      value: "",
    },
  ]);
  const [otherEnabled, setOtherEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {options.map((option, index) => (
        <div key={option.id} className="flex items-center space-x-2">
          <div className="border-[1px] p-1.5 rounded-full">
            {type === "radio" && (
              <IoMdRadioButtonOff className="h-[1.2rem] w-[1.2rem]" />
            )}
            {type === "check" && (
              <MdOutlineCheckBoxOutlineBlank className="h-[1.2rem] w-[1.2rem]" />
            )}
            {type === "dropdown" && index + 1}
          </div>
          <Input required />
          <Button
            size={"icon"}
            variant={"outline"}
            disabled={options.length <= 1}
            onClick={() => {
              setOptions((prev) => prev.filter((val) => option.id !== val.id));
            }}
          >
            <IoClose className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      ))}
      {otherEnabled && type !== "dropdown" && (
        <div className="flex items-center space-x-2">
          <div className="border-[1px] p-1.5 rounded-full">
            {type === "radio" && (
              <IoMdRadioButtonOff className="h-[1.2rem] w-[1.2rem]" />
            )}
            {type === "check" && (
              <MdOutlineCheckBoxOutlineBlank className="h-[1.2rem] w-[1.2rem]" />
            )}
          </div>
          <Input readOnly placeholder="Other" />
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => setOtherEnabled(false)}
          >
            <IoClose className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      )}
      <div className="flex mt-2 gap-2">
        <Button
          variant={"outline"}
          onClick={() => {
            setOptions([
              ...options,
              {
                id: uuidv4(),
                value: "",
              },
            ]);
          }}
        >
          Add Option
        </Button>
        {type !== "dropdown" && !otherEnabled && (
          <Button
            variant={"outline"}
            disabled={otherEnabled}
            onClick={() => setOtherEnabled(true)}
          >
            Add Other
          </Button>
        )}
      </div>
    </div>
  );
};
