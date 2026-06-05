import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

export function ChangePill({ value, className }: { value: number; className?: string }) {
  const pos = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums",
        pos
          ? "bg-success/10 text-success"
          : "bg-destructive/10 text-destructive",
        className,
      )}
    >
      {pos ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {Math.abs(value).toFixed(2)}%
    </span>
  );
}
