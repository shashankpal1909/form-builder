import React from "react";
import { MdAdd, MdContentCopy, MdDeleteOutline } from "react-icons/md";

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import QuestionComponent from "./question";

interface Option {
  id: string;
  value: string;
}

interface Question {
  id: string;
  type: string;
  content: string;
  options?: Option[];
  required: boolean;
  hasOtherOption: boolean;
}

interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

type Props = {
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  removeQuestion: (questionId: string) => void;
  toggleRequired: (questionId: string) => void;
  copyQuestion: (questionId: string, sectionId: string) => void;
  addOption: (sectionId: string) => void;
  removeOption: (questionId: string, optionId: string) => void;
  updateOption: (questionId: string, optionId: string, value: string) => void;
  toggleOtherOption: (questionId: string) => void;
  copySection: (sectionId: string) => void;
  removeSection: (sectionId: string) => void;
  addQuestion: (sectionId: string) => void;
  updateQuestionTitle: (questionId: string, content: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  updateSectionDescription: (sectionId: string, description: string) => void;
};

const SectionComponent = ({
  sections,
  setSections,
  removeQuestion,
  toggleRequired,
  copyQuestion,
  addOption,
  removeOption,
  updateOption,
  toggleOtherOption,
  copySection,
  removeSection,
  addQuestion,
  updateQuestionTitle,
  updateSectionTitle,
  updateSectionDescription,
}: Props) => {
  return sections.map((section, index) => (
    <div key={section.id} className="flex gap-2 flex-col w-full">
      <div className="flex justify-between items-center">
        <Label className="font-bold text-lg">
          {`Section ${index + 1} of ${sections.length}`}
        </Label>
        <div className="flex gap-2">
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => copySection(section.id)}
          >
            <MdContentCopy className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"icon"} variant={"outline"}>
                <MdDeleteOutline className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => removeSection(section.id)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <Input
        placeholder="Section title"
        required
        value={section.title}
        onChange={(event) => {
          updateSectionTitle(section.id, event.target.value);
        }}
      />
      <Input
        placeholder="Section description"
        value={section.description}
        onChange={(event) => {
          updateSectionDescription(section.id, event.target.value);
        }}
      />
      <QuestionComponent
        section={section}
        questions={section.questions}
        setSections={setSections}
        removeQuestion={removeQuestion}
        toggleRequired={toggleRequired}
        copyQuestion={copyQuestion}
        addOption={addOption}
        removeOption={removeOption}
        updateOption={updateOption}
        toggleOtherOption={toggleOtherOption}
        updateQuestionTitle={updateQuestionTitle}
      />
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
  ));
};

export default SectionComponent;
