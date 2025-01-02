import * as React from "react";

// Utility function for conditional class names
import { cn } from "@/lib/utils";

// Interface for InputProps extending native input attributes
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// Input component using forwardRef for enhanced compatibility
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

// Display name for debugging and React DevTools
Input.displayName = "Input";

// Exporting the component
export { Input };
