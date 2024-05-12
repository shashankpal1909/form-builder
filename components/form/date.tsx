import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {};

const DateComponent = (props: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          onClick={(e) => {
            e.preventDefault();
          }}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>Pick a date</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" initialFocus />
      </PopoverContent>
    </Popover>
  );
};

export default DateComponent;
