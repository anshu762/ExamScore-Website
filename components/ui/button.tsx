import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent" | "link";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary-light":
              variant === "primary",
            "bg-secondary text-secondary-foreground hover:bg-border":
              variant === "secondary",
            "border border-border bg-transparent hover:bg-secondary":
              variant === "outline",
            "hover:bg-secondary": variant === "ghost",
            "bg-accent text-accent-foreground hover:bg-accent-light":
              variant === "accent",
            "text-primary underline-offset-4 hover:underline":
              variant === "link",
          },
          {
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-4": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
