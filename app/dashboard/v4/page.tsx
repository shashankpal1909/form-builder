"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdRadioButtonOff } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import {
    MdAdd, MdContentCopy, MdDeleteOutline, MdOutlineCheckBoxOutlineBlank
} from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

type Section = {
  id: string;
};

type Question = {
  id: string;
  type: "short" | "paragraph" | "check" | "radio" | "dropdown";
  required?: boolean;
  content?: string;
  options?: Option[]; // Add options property
};

type Option = {
  id: string;
  value: string;
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
          <SectionComponent key={section.id} />
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

const SectionComponent = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: uuidv4(),
      type: "short",
    },
  ]);

  // Function to copy a question
  const copyQuestion = (id: string) => {
    const questionToCopy = questions.find((q) => q.id === id);
    if (questionToCopy) {
      const copiedOptions = questionToCopy.options?.map((opt) => ({
        ...opt,
        id: uuidv4(),
      }));
      console.log("options", copiedOptions);

      setQuestions((prev) => [
        ...prev,
        {
          id: uuidv4(),
          type: questionToCopy.type,
          content: questionToCopy.content,
          options: copiedOptions, // Copying options array
        },
      ]);
    }
  };

  // Function to toggle required state of a question
  const toggleRequired = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, required: !q.required } : q))
    );
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {questions.map((question) => (
        <Card key={question.id} className="h-min flex flex-col w-full">
          <CardHeader>
            <CardTitle className="flex gap-2 justify-center items-center">
              <Input
                placeholder="enter your question"
                value={question.content} // Setting value of Input to question content
                onChange={(e) =>
                  setQuestions((prev) =>
                    prev.map((q) =>
                      q.id === question.id
                        ? { ...q, content: e.target.value }
                        : q
                    )
                  )
                }
              />
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
                  {question.type === "short" && "Short Answer"}
                  {question.type === "paragraph" && "Paragraph"}
                  {(question.type === "check" ||
                    question.type === "radio" ||
                    question.type === "dropdown") &&
                    "Options"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short Answer</SelectItem>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
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
              question.type === "dropdown") && (
              <OptionsComponent type={question.type} />
            )}
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-end p-4 gap-2">
            <Button
              size={"icon"}
              variant={"outline"}
              onClick={() => copyQuestion(question.id)}
            >
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
              <Switch
                onChange={() => toggleRequired(question.id)}
                checked={question.required}
              />
              <label>Required?</label>
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
  return <Input readOnly placeholder="Short Answer" />;
};

const ParagraphAnswer = () => {
  return <Textarea readOnly placeholder="Paragraph" />;
};

const OptionsComponent = ({
  type,
}: {
  type: "radio" | "check" | "dropdown";
}) => {
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
          <Input
            required
            value={option.value}
            onChange={(e) =>
              setOptions((prev) =>
                prev.map((opt) =>
                  opt.id === option.id ? { ...opt, value: e.target.value } : opt
                )
              )
            }
          />
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
