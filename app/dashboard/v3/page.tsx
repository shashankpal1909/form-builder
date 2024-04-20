"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Types
type QuestionType =
  | "short"
  | "paragraph"
  | "singleChoice"
  | "multipleChoice"
  | "dropdown";

interface Question {
  id: string;
  type: QuestionType;
  title: string;
  options?: string[];
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

const FormBuilder: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([
    {
      id: uuidv4(),
      title: "Section 1",
      questions: [],
    },
  ]);

  const addQuestion = (sectionId: string, type: QuestionType) => {
    const newQuestion: Question = {
      id: uuidv4(),
      type,
      title: "",
      options:
        type === "singleChoice" ||
        type === "multipleChoice" ||
        type === "dropdown"
          ? ["Option 1"]
          : undefined,
    };

    const updatedSections = sections.map((section) =>
      section.id === sectionId
        ? { ...section, questions: [...section.questions, newQuestion] }
        : section
    );

    setSections(updatedSections);
  };

  const addSection = () => {
    setSections([
      ...sections,
      { id: uuidv4(), title: `Section ${sections.length + 1}`, questions: [] },
    ]);
  };

  const updateQuestionTitle = (
    sectionId: string,
    questionId: string,
    title: string
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.map((question) =>
          question.id === questionId ? { ...question, title } : question
        );
        return { ...section, questions: updatedQuestions };
      }
      return section;
    });

    setSections(updatedSections);
  };

  const updateOption = (
    sectionId: string,
    questionId: string,
    optionIndex: number,
    optionValue: string
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.map((question) => {
          if (question.id === questionId && question.options) {
            const updatedOptions = [...question.options];
            updatedOptions[optionIndex] = optionValue;
            return { ...question, options: updatedOptions };
          }
          return question;
        });
        return { ...section, questions: updatedQuestions };
      }
      return section;
    });

    setSections(updatedSections);
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.filter(
          (question) => question.id !== questionId
        );
        return { ...section, questions: updatedQuestions };
      }
      return section;
    });

    setSections(updatedSections);
  };

  const deleteOption = (
    sectionId: string,
    questionId: string,
    optionIndex: number
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.map((question) => {
          if (question.id === questionId && question.options) {
            const updatedOptions = question.options.filter(
              (_, index) => index !== optionIndex
            );
            return { ...question, options: updatedOptions };
          }
          return question;
        });
        return { ...section, questions: updatedQuestions };
      }
      return section;
    });

    setSections(updatedSections);
  };

  const previewForm = () => {
    const formPreviewWindow = window.open("", "_blank");
    if (formPreviewWindow) {
      formPreviewWindow.document.write(`
        <html>
          <head>
            <title>Form Preview</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="p-8 bg-gray-100">
            <h1 class="text-2xl mb-8">Form Preview</h1>
      `);

      sections.forEach((section) => {
        formPreviewWindow.document.write(`<div class="mb-8">`);
        formPreviewWindow.document.write(
          `<h2 class="text-xl mb-4">${section.title}</h2>`
        );
        section.questions.forEach((question) => {
          formPreviewWindow.document.write(`<div class="mb-4">`);
          formPreviewWindow.document.write(
            `<h3 class="text-lg mb-2">${question.title}</h3>`
          );
          if (question.type === "short") {
            formPreviewWindow.document.write(
              '<input type="text" placeholder="Short answer" class="border p-2 w-full">'
            );
          } else if (question.type === "paragraph") {
            formPreviewWindow.document.write(
              '<textarea placeholder="Paragraph answer" class="border p-2 w-full"></textarea>'
            );
          } else if (question.type === "singleChoice") {
            formPreviewWindow.document.write(
              '<select class="border p-2 w-full">'
            );
            question.options?.forEach((option) => {
              formPreviewWindow.document.write(
                `<option value="${option}">${option}</option>`
              );
            });
            formPreviewWindow.document.write("</select>");
          } else if (question.type === "multipleChoice") {
            question.options?.forEach((option) => {
              formPreviewWindow.document.write(
                `<div class="flex items-center mb-2">`
              );
              formPreviewWindow.document.write(
                `<input type="checkbox" name="${question.id}" value="${option}" class="mr-2">`
              );
              formPreviewWindow.document.write(`<label>${option}</label>`);
              formPreviewWindow.document.write(`</div>`);
            });
          } else if (question.type === "dropdown") {
            formPreviewWindow.document.write(
              '<select class="border p-2 w-full">'
            );
            question.options?.forEach((option) => {
              formPreviewWindow.document.write(
                `<option value="${option}">${option}</option>`
              );
            });
            formPreviewWindow.document.write("</select>");
          }
          formPreviewWindow.document.write(`</div>`);
        });
        formPreviewWindow.document.write(`</div>`);
      });

      formPreviewWindow.document.write(`
          </body>
        </html>
      `);
      formPreviewWindow.document.close();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Form Builder</h1>

      <button
        className="bg-blue-500 text-white px-4 py-2 mb-4"
        onClick={addSection}
      >
        Add Section
      </button>

      <button
        className="bg-green-500 text-white px-4 py-2 mb-4 ml-4"
        onClick={previewForm}
      >
        Preview
      </button>

      {sections.map((section) => (
        <div key={section.id} className="mb-8 border rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl">{section.title}</h2>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() =>
                setSections(sections.filter((s) => s.id !== section.id))
              }
            >
              Delete Section
            </button>
          </div>

          <div className="space-y-4">
            {section.questions.map((question) => (
              <div key={question.id} className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    placeholder="Question title"
                    className="border p-2 flex-grow mr-2"
                    value={question.title}
                    onChange={(e) =>
                      updateQuestionTitle(
                        section.id,
                        question.id,
                        e.target.value
                      )
                    }
                  />
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => deleteQuestion(section.id, question.id)}
                  >
                    Delete
                  </button>
                </div>

                {question.type === "singleChoice" ||
                question.type === "multipleChoice" ||
                question.type === "dropdown" ? (
                  <div className="space-y-2">
                    {question.options?.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          placeholder={`Option ${index + 1}`}
                          className="border p-2 flex-grow mr-2"
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              section.id,
                              question.id,
                              index,
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() =>
                            deleteOption(section.id, question.id, index)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      className="bg-blue-500 text-white px-4 py-2"
                      onClick={() => {
                        if (question.options) {
                          updateOption(
                            section.id,
                            question.id,
                            question.options.length,
                            ""
                          );
                        }
                      }}
                    >
                      Add Option
                    </button>
                  </div>
                ) : null}
              </div>
            ))}

            <div className="flex justify-center">
              <button
                className="bg-green-500 text-white px-4 py-2"
                onClick={() => addQuestion(section.id, "short")}
              >
                Add Short Answer
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 ml-4"
                onClick={() => addQuestion(section.id, "paragraph")}
              >
                Add Paragraph Answer
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 ml-4"
                onClick={() => addQuestion(section.id, "singleChoice")}
              >
                Add Single Choice
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 ml-4"
                onClick={() => addQuestion(section.id, "multipleChoice")}
              >
                Add Multiple Choice
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 ml-4"
                onClick={() => addQuestion(section.id, "dropdown")}
              >
                Add Dropdown
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormBuilder;
