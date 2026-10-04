import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  label,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
      {label && (
        <span className="text-sm font-medium text-gray-600">{label}</span>
      )}
    </div>
  );
};
