"use client";

import React, { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

interface Option {
  id: string;
  value: string;
}

interface Question {
  id: string;
  type: string;
  content?: string;
  options?: Option[];
  required: boolean;
  hasOtherOption: boolean;
}

interface Section {
  id: string;
  questions: Question[];
}

const InputForm: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: uuidv4(),
      questions: [
        {
          id: uuidv4(),
          type: "short",
          options: [{ id: uuidv4(), value: "" }],
          required: false,
          hasOtherOption: false,
        },
      ],
    },
  ]);

  const copyQuestion = (questionId: string, sectionId: string) => {
    const copiedQuestion = sections
      .flatMap((section) => section.questions)
      .find((q) => q.id === questionId);
    if (copiedQuestion) {
      const copiedOptions =
        copiedQuestion.options?.map((opt) => ({ ...opt, id: uuidv4() })) || [];
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          questions:
            section.id === sectionId
              ? section.questions.reduce<Question[]>((acc, q) => {
                  acc.push(q);
                  if (q.id === questionId) {
                    acc.push({
                      id: uuidv4(),
                      type: copiedQuestion.type,
                      content: copiedQuestion.content,
                      options: copiedOptions,
                      required: copiedQuestion.required,
                      hasOtherOption: copiedQuestion.hasOtherOption,
                    });
                  }
                  return acc;
                }, [])
              : section.questions,
        }))
      );
    }
  };

  const toggleRequired = (questionId: string) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === questionId ? { ...q, required: !q.required } : q
        ),
      }))
    );
  };

  const addQuestion = (sectionId: string) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        questions:
          section.id === sectionId
            ? [
                ...section.questions,
                {
                  id: uuidv4(),
                  type: "short",
                  options: [{ id: uuidv4(), value: "" }],
                  required: false,
                  hasOtherOption: false,
                },
              ]
            : section.questions,
      }))
    );
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        id: uuidv4(),
        questions: [
          {
            id: uuidv4(),
            type: "short",
            options: [{ id: uuidv4(), value: "" }],
            required: false,
            hasOtherOption: false,
          },
        ],
      },
    ]);
  };

  const addOption = (questionId: string) => {
    const sectionIndex = sections.findIndex((section) =>
      section.questions.some((q) => q.id === questionId)
    );
    if (sectionIndex !== -1) {
      const newOption: Option = {
        id: uuidv4(),
        value: "",
      };
      setSections((prev) =>
        prev.map((section, index) => ({
          ...section,
          questions:
            sectionIndex === index
              ? section.questions.map((q) =>
                  q.id === questionId
                    ? { ...q, options: [...(q.options || []), newOption] }
                    : q
                )
              : section.questions,
        }))
      );
    }
  };

  const removeOption = (questionId: string, optionId: string) => {
    const sectionIndex = sections.findIndex((section) =>
      section.questions.some((q) => q.id === questionId)
    );
    if (sectionIndex !== -1) {
      setSections((prev) =>
        prev.map((section, index) => ({
          ...section,
          questions:
            sectionIndex === index
              ? section.questions.map((q) =>
                  q.id === questionId
                    ? {
                        ...q,
                        options: (q.options || []).filter(
                          (opt) => opt.id !== optionId
                        ),
                      }
                    : q
                )
              : section.questions,
        }))
      );
    }
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    value: string
  ) => {
    const sectionIndex = sections.findIndex((section) =>
      section.questions.some((q) => q.id === questionId)
    );
    if (sectionIndex !== -1) {
      setSections((prev) =>
        prev.map((section, index) => ({
          ...section,
          questions:
            sectionIndex === index
              ? section.questions.map((q) =>
                  q.id === questionId
                    ? {
                        ...q,
                        options: (q.options || []).map((opt) =>
                          opt.id === optionId ? { ...opt, value } : opt
                        ),
                      }
                    : q
                )
              : section.questions,
        }))
      );
    }
  };

  const toggleOtherOption = (questionId: string) => {
    const sectionIndex = sections.findIndex((section) =>
      section.questions.some((q) => q.id === questionId)
    );
    if (sectionIndex !== -1) {
      setSections((prev) =>
        prev.map((section, index) => ({
          ...section,
          questions:
            sectionIndex === index
              ? section.questions.map((q) =>
                  q.id === questionId
                    ? { ...q, hasOtherOption: !q.hasOtherOption }
                    : q
                )
              : section.questions,
        }))
      );
    }
  };

  const removeQuestion = (questionId: string) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        questions: section.questions.filter((q) => q.id !== questionId),
      }))
    );
  };

  useEffect(() => {
    console.log(sections);
  }, [sections]);

  return (
    <div className="container h-screen mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between py-4 gap-4">
      {sections.map((section) => (
        <div key={section.id} className="flex gap-2 flex-col w-full">
          {section.questions.map((question) => (
            <div key={question.id}>
              <Card className="h-min flex flex-col w-full">
                <CardHeader>
                  <CardTitle className="flex gap-2 justify-center items-center">
                    <Input placeholder="Enter your question" />
                    <Select
                      defaultValue={question.type}
                      onValueChange={(value) =>
                        setSections((prev) =>
                          prev.map((sec) => ({
                            ...sec,
                            questions: sec.questions.map((q) =>
                              q.id === question.id ? { ...q, type: value } : q
                            ),
                          }))
                        )
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        {question.type === "short" && "Short Answer"}
                        {question.type === "paragraph" && "Paragraph"}
                        {["check", "radio", "dropdown"].includes(
                          question.type
                        ) && "Multiple choice"}
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
                  {["check", "radio", "dropdown"].includes(question.type) && (
                    <OptionsComponent
                      type={question.type}
                      questionId={question.id}
                      options={question.options || []}
                      hasOtherOption={question.hasOtherOption}
                      onToggleOtherOption={() => toggleOtherOption(question.id)}
                      onAddOption={() => addOption(question.id)}
                      onRemoveOption={(optionId) =>
                        removeOption(question.id, optionId)
                      }
                      onUpdateOption={(optionId, value) =>
                        updateOption(question.id, optionId, value)
                      }
                    />
                  )}
                </CardContent>
                <Separator />
                <CardFooter className="flex justify-end p-4 gap-2">
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => copyQuestion(question.id, section.id)}
                  >
                    <MdContentCopy className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => removeQuestion(question.id)}
                  >
                    <MdDeleteOutline className="h-[1.2rem] w-[1.2rem]" />
                  </Button>
                  <Separator orientation="vertical" />
                  <div className="flex justify-center items-center gap-1">
                    <Label>Required?</Label>
                    <Switch
                      checked={question.required}
                      onClick={() => toggleRequired(question.id)}
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
          <div className="flex">
            <Button
              size={"default"}
              variant={"outline"}
              onClick={() => addQuestion(section.id)}
            >
              <MdAdd className="h-[1.2rem] w-[1.2rem]" />
              &nbsp;Add Question
            </Button>
          </div>
        </div>
      ))}
      <div className="flex">
        <Button
          size={"default"}
          variant={"outline"}
          onClick={() => addSection()}
        >
          <MdAdd className="h-[1.2rem] w-[1.2rem]" />
          &nbsp;Add Section
        </Button>
      </div>
    </div>
  );
};

const OptionsComponent: React.FC<{
  type: string;
  questionId: string;
  options: Option[];
  hasOtherOption: boolean;
  onToggleOtherOption: () => void;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onUpdateOption: (optionId: string, value: string) => void;
}> = ({
  type,
  questionId,
  options,
  hasOtherOption,
  onToggleOtherOption,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <div className="border-[1px] p-1.5 rounded-full">
            {type === "radio" && (
              <IoMdRadioButtonOff className="h-[1.2rem] w-[1.2rem]" />
            )}
            {type === "check" && (
              <MdOutlineCheckBoxOutlineBlank className="h-[1.2rem] w-[1.2rem]" />
            )}
            {type === "dropdown" && options.indexOf(option) + 1}
          </div>
          <Input
            required
            value={option.value}
            onChange={(e) => onUpdateOption(option.id, e.target.value)}
          />
          <Button
            size={"icon"}
            variant={"outline"}
            disabled={options.length <= 1}
            onClick={() => onRemoveOption(option.id)}
          >
            <IoClose className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      ))}
      {hasOtherOption && (
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
            onClick={() => onToggleOtherOption()}
          >
            <IoClose className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      )}
      <div className="flex mt-2 gap-2">
        <Button variant={"outline"} onClick={() => onAddOption()}>
          Add Option
        </Button>
        {!hasOtherOption && (
          <Button variant={"outline"} onClick={() => onToggleOtherOption()}>
            Add Other
          </Button>
        )}
      </div>
    </div>
  );
};

const ShortAnswer: React.FC = () => {
  return <Input readOnly placeholder="Short Answer" />;
};

const ParagraphAnswer: React.FC = () => {
  return <Textarea readOnly placeholder="Paragraph" />;
};

export default InputForm;
