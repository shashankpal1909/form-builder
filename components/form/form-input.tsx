import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

import LoadingComponent from "../loading";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import SectionComponent from "./section";

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
  formId: string;
};

const FormInputComponent = ({ formId }: Props) => {
  const [title, setTitle] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<true | false>(true);

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);

      const response = await fetch(`/api/forms/${formId}`, {
        method: "POST",
      });
      const data = await response.json();

      console.log("fetched form:", data);

      setTitle(data.form.title);
      setSections(data.form.sections);

      setLoading(false);
    };
    fetchForm();
  }, [formId]);

  useEffect(() => {
    console.log("sections", sections);
  }, [sections]);

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
            options: q.options?.map((opt) => ({ ...opt, id: uuidv4() })),
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

  const updateQuestionTitle = (questionId: string, content: string) => {
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === questionId ? { ...q, content } : q
        ),
      }))
    );
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      )
    );
  };

  const updateSectionDescription = (sectionId: string, description: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, description } : section
      )
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
                  content: "",
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
            content: "",
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

  const [isSavingForm, setIsSavingForm] = useState(false);

  const handleFormSave = async (event: React.MouseEvent) => {
    setIsSavingForm(true);
    event.preventDefault();
    const response = await fetch("/api/forms/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formObject: {
          title,
          sections,
          id: formId,
        },
      }),
    });
    setIsSavingForm(false);
    console.log(response);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="container h-auto mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between py-4 gap-8">
      <Input
        placeholder="untitled form"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <SectionComponent
        sections={sections}
        setSections={setSections}
        removeQuestion={removeQuestion}
        toggleRequired={toggleRequired}
        copyQuestion={copyQuestion}
        addOption={addOption}
        removeOption={removeOption}
        updateOption={updateOption}
        toggleOtherOption={toggleOtherOption}
        copySection={copySection}
        removeSection={removeSection}
        addQuestion={addQuestion}
        updateQuestionTitle={updateQuestionTitle}
        updateSectionTitle={updateSectionTitle}
        updateSectionDescription={updateSectionDescription}
      />
      <div className="flex gap-2 flex-col w-full">
        <Button
          size={"default"}
          variant={"outline"}
          onClick={() => addSection()}
        >
          <MdAdd className="h-[1.2rem] w-[1.2rem]" />
          &nbsp;Add Section
        </Button>
      </div>

      <Button onClick={handleFormSave} disabled={isSavingForm}>
        {isSavingForm ? `Saving...` : `Save Form`}
      </Button>
    </div>
  );
};

export default FormInputComponent;
