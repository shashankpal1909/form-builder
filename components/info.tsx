import React from "react";
import { IconType } from "react-icons/lib";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type Props = {
  variant: "default" | "success" | "warning" | "error";
  title: string;
  description: string;
  Icon: IconType;
};

const InfoComponent = ({
  title,
  description,
  variant = "default",
  Icon,
}: Props) => {
  return (
    <Alert
      className={cn(
        variant === "success" && "text-green-600 dark:text-green-500",
        variant === "warning" && "text-yellow-600 dark:text-yellow-500",
        variant === "error" && "text-red-600 dark:text-red-500"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          variant === "success" && "fill-green-600 dark:fill-green-500",
          variant === "warning" && "fill-yellow-600 dark:fill-yellow-500",
          variant === "error" && "fill-red-600 dark:fill-red-500"
        )}
      />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default InfoComponent;
