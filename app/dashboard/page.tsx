"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Field {
  id: string;
  type: string;
  label: string;
}

interface Page {
  id: string;
  fields: Field[];
}

const FormBuilder: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([{ id: uuidv4(), fields: [] }]);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [fields, setFields] = useState<Field[]>([
    { id: uuidv4(), type: "text", label: "Text Field" },
    { id: uuidv4(), type: "checkbox", label: "Checkbox" },
  ]);

  const addPage = () => {
    setPages([...pages, { id: uuidv4(), fields: [] }]);
    setActivePageIndex(pages.length);
  };

  const addFieldToPage = (fieldType: string) => {
    const newField: Field = {
      id: uuidv4(),
      type: fieldType,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
    };
    const updatedPages = [...pages];
    updatedPages[activePageIndex].fields.push(newField);
    setPages(updatedPages);
  };

  const removeFieldFromPage = (fieldId: string) => {
    const updatedPages = [...pages];
    updatedPages[activePageIndex].fields = updatedPages[
      activePageIndex
    ].fields.filter((field) => field.id !== fieldId);
    setPages(updatedPages);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, newIndex: number) => {
    const fieldId = e.dataTransfer.getData("fieldId");
    const fieldType = e.dataTransfer.getData("fieldType");

    if (fieldId) {
      const updatedPages = [...pages];
      const draggedField = updatedPages[activePageIndex].fields.find(
        (field) => field.id === fieldId
      );

      if (draggedField) {
        updatedPages[activePageIndex].fields = updatedPages[
          activePageIndex
        ].fields.filter((field) => field.id !== fieldId);
        updatedPages[activePageIndex].fields.splice(newIndex, 0, draggedField);
        setPages(updatedPages);
      }
    }

    if (fieldType) {
      addFieldToPage(fieldType);
    }
  };

  return (
    <div className="flex justify-between items-start p-8 bg-gray-100 min-h-screen">
      <div className="w-1/4 space-y-4">
        <h2 className="text-xl font-bold">Form Fields</h2>
        <Button
          onClick={() => addFieldToPage("text")}
          className="w-full p-4 bg-white shadow-md rounded cursor-pointer hover:bg-gray-200"
        >
          Add Text Field
        </Button>
        <Button
          onClick={() => addFieldToPage("checkbox")}
          className="w-full p-4 bg-white shadow-md rounded cursor-pointer hover:bg-gray-200"
        >
          Add Checkbox
        </Button>
      </div>
      <div
        className="flex-grow bg-white shadow-md p-8 rounded"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, pages[activePageIndex]?.fields.length || 0)}
      >
        {pages[activePageIndex]?.fields.map((field, index) => (
          <div
            key={field.id}
            className="mb-4 p-4 bg-gray-200 rounded cursor-move"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("fieldId", field.id)}
            onDrop={(e) => onDrop(e, index)}
            onDragOver={onDragOver}
          >
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input id={field.id} type={field.type} />
            <Button
              className="mt-2"
              onClick={() => removeFieldFromPage(field.id)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div className="w-1/4 space-y-4">
        <h2 className="text-xl font-bold">Page Navigation</h2>
        {pages.map((page, index) => (
          <Button
            key={page.id}
            className={`w-full ${
              activePageIndex === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActivePageIndex(index)}
          >
            Page {index + 1}
          </Button>
        ))}
        <Button className="w-full mt-4" onClick={addPage}>
          Add Page
        </Button>
      </div>
    </div>
  );
};

export default FormBuilder;
