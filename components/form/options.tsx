import React from "react";
import { IoMdRadioButtonOff } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
  type: string;
  questionId: string;
  options: Option[];
  hasOtherOption: boolean;
  onToggleOtherOption: () => void;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onUpdateOption: (optionId: string, value: string) => void;
};

interface Option {
  id: string;
  value: string;
}

const OptionsComponent = ({
  type,
  options,
  hasOtherOption,
  onToggleOtherOption,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
}: Props) => {
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
      {hasOtherOption && type !== "dropdown" && (
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
        {!hasOtherOption && type !== "dropdown" && (
          <Button variant={"outline"} onClick={() => onToggleOtherOption()}>
            Add Other
          </Button>
        )}
      </div>
    </div>
  );
};

export default OptionsComponent;
