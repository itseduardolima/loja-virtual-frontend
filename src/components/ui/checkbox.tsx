import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, id, ...props }, ref) => {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        disabled={disabled}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600",
          className
        )}
        onClick={() => onCheckedChange?.(!checked)}
        ref={ref}
        {...props}
      >
        {checked && <Check className="h-3 w-3" />}
        <span className="sr-only">
          {checked ? "Uncheck" : "Check"}
        </span>
      </button>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
