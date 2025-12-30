import { cn } from "@/lib/utils";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "active";
  size?: "sm" | "md";
}

export function Tag({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        // Base styles
        "inline-flex items-center rounded-full font-medium transition-colors duration-200",

        // Variant styles
        variant === "default" && [
          "bg-palm-leaf-3/10 text-palm-leaf-3",
          "border border-transparent",
          "hover:border-palm-leaf-3/30",
        ],
        variant === "active" && [
          "bg-palm-leaf text-white",
        ],

        // Size styles
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",

        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
