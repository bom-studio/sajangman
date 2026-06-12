import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalculatorModeToggleProps<T extends string> {
  modes: { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function CalculatorModeToggle<T extends string>({
  modes,
  value,
  onChange,
  className,
}: CalculatorModeToggleProps<T>) {
  return (
    <div
      className={cn(
        "grid gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1",
        modes.length === 2 ? "grid-cols-2" : `grid-cols-${modes.length}`,
        className
      )}
      style={
        modes.length > 2
          ? { gridTemplateColumns: `repeat(${modes.length}, minmax(0, 1fr))` }
          : undefined
      }
    >
      {modes.map((mode) => (
        <Button
          key={mode.id}
          type="button"
          variant={value === mode.id ? "default" : "ghost"}
          size="sm"
          className={cn(
            "h-9 rounded-lg text-sm font-medium",
            value !== mode.id && "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onChange(mode.id)}
        >
          {mode.label}
        </Button>
      ))}
    </div>
  )
}
