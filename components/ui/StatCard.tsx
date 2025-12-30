import { cn } from "@/lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  highlight?: boolean;
}

export function StatCard({
  value,
  label,
  highlight = false,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center p-6 rounded-lg",
        "bg-soft-linen-light border border-soft-linen-dark",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "text-4xl lg:text-5xl font-display font-bold",
          highlight ? "text-bronze-spice" : "text-palm-leaf"
        )}
      >
        {value}
      </span>
      <span className="mt-2 text-sm text-text-secondary">{label}</span>
    </div>
  );
}
