import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function Divider({ label, className, ...props }: DividerProps) {
  if (label) {
    return (
      <div
        className={cn("relative flex items-center py-4", className)}
        {...props}
      >
        <div className="flex-1 border-t border-soft-linen-dark" />
        <span className="px-4 text-sm text-text-muted bg-soft-linen">
          {label}
        </span>
        <div className="flex-1 border-t border-soft-linen-dark" />
      </div>
    );
  }

  return (
    <hr
      className={cn("border-t border-soft-linen-dark my-8", className)}
      {...props}
    />
  );
}
