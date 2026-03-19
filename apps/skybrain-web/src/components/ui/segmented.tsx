import * as React from "react"
import { cn } from "@/lib/utils"

interface SegmentedProps extends React.HTMLAttributes<HTMLDivElement> {
  options: {
    value: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  value: string
  onValueChange: (value: string) => void
}

export function Segmented({ className, options, value, onValueChange, ...props }: SegmentedProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {options.map((option) => {
        const Icon = option.icon
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "hover:bg-background/50 hover:text-foreground"
            )}
          >
            {Icon && <Icon className="h-4 w-4 mr-1.5" />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}