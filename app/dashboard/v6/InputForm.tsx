"use client";
import React, { useState } from "react";
import { MdAdd, MdContentCopy, MdDeleteOutline } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { saveForm } from "@/lib/actions/save-form";

import { Option, OptionsComponent, ParagraphAnswer, Question, Section, ShortAnswer } from "./page";

export const InputForm: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: uuidv4(),
      title: "",
      description: "",
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

  const copySection = (sectionId: string) => {
    const sectionToCopy = sections.find((s) => s.id === sectionId);
    if (sectionToCopy) {
      setSections((prev) => [
        ...prev,
        {
          id: uuidv4(),
          title: sectionToCopy.title,
          description: sectionToCopy.description,
          questions: sectionToCopy.questions.map((q) => ({
            ...q,
            id: uuidv4(),
          })),
        },
      ]);
    }
  };

  const removeSection = (sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const copyQuestion = (questionId: string, sectionId: string) => {
    const copiedQuestion = sections
      .flatMap((section) => section.questions)
      .find((q) => q.id === questionId);
    if (copiedQuestion) {
      const copiedOptions = copiedQuestion.options?.map((opt) => ({ ...opt, id: uuidv4() })) || [];
      setSections((prev) => prev.map((section) => ({
        ...section,
        questions: section.id === sectionId
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
    setSections((prev) => prev.map((section) => ({
      ...section,
      questions: section.questions.map((q) => q.id === questionId ? { ...q, required: !q.required } : q
      ),
    }))
    );
  };

  const addQuestion = (sectionId: string) => {
    setSections((prev) => prev.map((section) => ({
      ...section,
      questions: section.id === sectionId
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
        title: "",
        description: "",
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
    const sectionIndex = sections.findIndex((section) => section.questions.some((q) => q.id === questionId)
    );
    if (sectionIndex !== -1) {
      const newOption: Option = {
        id: uuidv4(),
        value: "",
      };
      setSections((prev) => prev.map((section, index) => ({
        ...section,
        questions: sectionIndex === index
          ? section.questions.map((q) => q.id === questionId
            ? { ...q, options: [...(q.options || []), newOption] }
            : q
          )
          : section.questions,
      }))
      );
    }
  };

  const removeOption = (questionId: string, optionId: string) => {
    const sectionIndex = sections.findIndex((section) => section.questions.some((q) => q.id === questionId)
    );
    if (sectionIndex !== -1) {
      setSections((prev) => prev.map((section, index) => ({
        ...section,
        questions: sectionIndex === index
          ? section.questions.map((q) => q.id === questionId
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
    const sectionIndex = sections.findIndex((section) => section.questions.some((q) => q.id === questionId)
    );
    if (sectionIndex !== -1) {
      setSections((prev) => prev.map((section, index) => ({
        ...section,
        questions: sectionIndex === index
          ? section.questions.map((q) => q.id === questionId
            ? {
              ...q,
              options: (q.options || []).map((opt) => opt.id === optionId ? { ...opt, value } : opt
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
    const sectionIndex = sections.findIndex((section) => section.questions.some((q) => q.id === questionId)
    );
    if (sectionIndex !== -1) {
      setSections((prev) => prev.map((section, index) => ({
        ...section,
        questions: sectionIndex === index
          ? section.questions.map((q) => q.id === questionId
            ? { ...q, hasOtherOption: !q.hasOtherOption }
            : q
          )
          : section.questions,
      }))
      );
    }
  };

  const removeQuestion = (questionId: string) => {
    setSections((prev) => prev.map((section) => ({
      ...section,
      questions: section.questions.filter((q) => q.id !== questionId),
    }))
    );
  };

  const handleFormSave = async (event: React.MouseEvent) => {
    event.preventDefault();
    const response = await fetch("/api/forms/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formObject: {
          title: "sample title",
          sections,
        },
      }),
    });
    console.log(response);
  };

  const saveFormAction = saveForm.bind(null, {
    title: "sample title",
    sections,
  });

  return (
    // <form action={saveFormAction}>
    <div className="container h-auto mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between py-4 gap-8">
      <Input placeholder="untitled form" />

      {sections.map((section, index) => (
        <div key={section.id} className="flex gap-2 flex-col w-full">
          <div className="flex justify-between items-center">
            <Label className="font-bold text-lg">
              {`Section ${index + 1} of ${sections.length}`}
            </Label>
            <div className="flex gap-2">
              <Button
                size={"default"}
                variant={"outline"}
                onClick={() => copySection(section.id)}
              >
                <MdContentCopy className="h-[1.2rem] w-[1.2rem]" />
                &nbsp;Duplicate Section
              </Button>
              <Button
                size={"default"}
                variant={"outline"}
                onClick={() => removeSection(section.id)}
              >
                <MdDeleteOutline className="h-[1.2rem] w-[1.2rem]" />
                &nbsp;Delete Section
              </Button>
            </div>
          </div>
          <Input placeholder="Section title" required />
          <Input placeholder="Section description" />
          {section.questions.map((question) => (
            <div key={question.id}>
              <Card className="h-min flex flex-col w-full">
                <CardHeader>
                  <CardTitle className="flex gap-2 justify-center items-center">
                    <Input placeholder="Enter your question" />
                    <Select
                      defaultValue={question.type}
                      onValueChange={(value) => setSections((prev) => prev.map((sec) => ({
                        ...sec,
                        questions: sec.questions.map((q) => q.id === question.id ? { ...q, type: value } : q
                        ),
                      }))
                      )}
                    >
                      <SelectTrigger className="w-[180px]">
                        {question.type === "short" && "Short Answer"}
                        {question.type === "paragraph" && "Paragraph"}
                        {question.type === "radio" && "Multiple choice"}
                        {question.type === "check" && "Checkboxes"}
                        {question.type === "dropdown" && "Dropdown"}
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
                      onRemoveOption={(optionId) => removeOption(question.id, optionId)}
                      onUpdateOption={(optionId, value) => updateOption(question.id, optionId, value)} />
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
                      onClick={() => toggleRequired(question.id)} />
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
          <Separator />
        </div>
      ))}
      <div className="flex gap-2 flex-col w-full">
        <Button
          size={"default"}
          variant={"default"}
          onClick={() => addSection()}
        >
          <MdAdd className="h-[1.2rem] w-[1.2rem]" />
          &nbsp;Add Section
        </Button>
      </div>

      <Button onClick={handleFormSave}>Save Form</Button>
    </div>
    // </form>
  );
};
