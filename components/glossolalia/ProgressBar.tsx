import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ progress, label, className }: ProgressBarProps) {
  const percent = Math.round(progress * 100);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-muted">{label}</span>
          <span className="text-xs text-text-muted">{percent}%</span>
        </div>
      )}
      <div className="w-full h-1 bg-soft-linen-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-palm-leaf rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
