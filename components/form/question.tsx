import React from "react";
import { MdContentCopy, MdDeleteOutline } from "react-icons/md";

import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import DateComponent from "./date";
import OptionsComponent from "./options";
import ParagraphAnswerComponent from "./paragraph-answer";
import ShortAnswerComponent from "./short-answer";

interface Option {
  id: string;
  value: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: string;
  content: string;
  options?: Option[];
  required: boolean;
  hasOtherOption: boolean;
}

type Props = {
  section: Section;
  questions: Question[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  removeQuestion: (questionId: string) => void;
  toggleRequired: (questionId: string) => void;
  copyQuestion: (questionId: string, sectionId: string) => void;
  addOption: (sectionId: string) => void;
  removeOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, value: string) => void;
  toggleOtherOption: (questionId: string) => void;
  updateQuestionTitle: (questionId: string, content: string) => void;
};

const QuestionComponent = ({
  section,
  questions,
  setSections,
  removeQuestion,
  addOption,
  copyQuestion,
  removeOption,
  toggleRequired,
  updateOption,
  toggleOtherOption,
  updateQuestionTitle,
}: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {questions.map((question) => (
        <div key={question.id}>
          <Card className="h-min flex flex-col w-full">
            <CardHeader>
              <CardTitle className="flex gap-2 justify-center items-center">
                <Input
                  placeholder="Enter your question"
                  value={question.content}
                  onChange={(event) => {
                    updateQuestionTitle(question.id, event.target.value);
                  }}
                />
                <Select
                  defaultValue={question.type}
                  onValueChange={(value) =>
                    setSections((prev) =>
                      prev.map((sec) => ({
                        ...sec,
                        questions: sec.questions.map((q) =>
                          q.id === question.id
                            ? {
                                ...q,
                                type: value,
                                options:
                                  value == "short" || value == "paragraph"
                                    ? []
                                    : q.options,
                              }
                            : q
                        ),
                      }))
                    )
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    {question.type === "short" && "Short Answer"}
                    {question.type === "paragraph" && "Paragraph"}
                    {question.type === "date" && "Date"}
                    {question.type === "radio" && "Multiple choice"}
                    {question.type === "check" && "Checkboxes"}
                    {question.type === "dropdown" && "Dropdown"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short Answer</SelectItem>
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="radio">Multiple choice</SelectItem>
                    <SelectItem value="check">Checkboxes</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col justify-end p-4 gap-4">
              {question.type === "short" && <ShortAnswerComponent />}
              {question.type === "paragraph" && <ParagraphAnswerComponent />}
              {question.type === "date" && <DateComponent />}
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
    </div>
  );
};

export default QuestionComponent;
