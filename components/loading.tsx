import React from "react";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const LoadingComponent = ({ className }: Props) => (
  <div className="flex justify-center items-center flex-grow">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="96"
      height="96"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <style>
        {`
          .spinner_l9ve {
            animation: spinner_rcyq 1.2s cubic-bezier(0.52,.6,.25,.99) infinite;
          }

          .spinner_cMYp {
            animation-delay: .4s;
          }

          .spinner_gHR3 {
            animation-delay: .8s;
          }

          @keyframes spinner_rcyq {
            0% {
              transform: translate(12px,12px) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(0,0) scale(1);
              opacity: 0;
            }
          }
        `}
      </style>
      <path
        className="spinner_l9ve"
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
        transform="translate(12, 12) scale(0)"
      />
      <path
        className="spinner_l9ve spinner_cMYp"
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
        transform="translate(12, 12) scale(0)"
      />
      <path
        className="spinner_l9ve spinner_gHR3"
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
        transform="translate(12, 12) scale(0)"
      />
    </svg>
  </div>
);

export default LoadingComponent;
