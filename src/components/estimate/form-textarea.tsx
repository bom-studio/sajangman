import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormTextareaProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
}

export function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  className,
  rows = 3,
}: FormTextareaProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label className="text-sm font-medium text-foreground">{label}</label>
      ) : null}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  )
}
