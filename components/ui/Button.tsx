import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-palm-leaf focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",

          // Variant styles
          variant === "primary" && [
            "bg-bronze-spice text-white",
            "hover:bg-bronze-spice-light",
            "active:bg-bronze-spice",
          ],
          variant === "secondary" && [
            "bg-palm-leaf text-white",
            "hover:bg-palm-leaf-2",
            "active:bg-palm-leaf-3",
          ],
          variant === "ghost" && [
            "bg-transparent text-text-primary",
            "hover:bg-soft-linen-dark/50 hover:text-palm-leaf",
            "active:bg-soft-linen-dark",
          ],

          // Size styles
          size === "sm" && "px-3 py-1.5 text-sm min-h-[36px]",
          size === "md" && "px-4 py-2 text-base min-h-[44px]",
          size === "lg" && "px-6 py-3 text-lg min-h-[52px]",

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
