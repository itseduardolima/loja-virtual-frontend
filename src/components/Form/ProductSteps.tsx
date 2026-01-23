'use client'

import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: number
  title: string
  description: string
}

interface ProductStepsProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
  completedSteps?: number[]
}

export function ProductSteps({ steps, currentStep, onStepClick, completedSteps = [] }: ProductStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id
          const isCompleted = completedSteps.includes(step.id)
          const isClickable = onStepClick && (isCompleted || index === 0 || completedSteps.includes(steps[index - 1]?.id))

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all mb-2",
                    isActive && "border-primary bg-primary text-white scale-110",
                    isCompleted && !isActive && "border-primary bg-primary text-white",
                    !isActive && !isCompleted && "border-gray-300 bg-white text-gray-400",
                    isClickable && "cursor-pointer hover:scale-105",
                    !isClickable && "cursor-not-allowed opacity-50"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="text-lg font-semibold">{step.id}</span>
                  )}
                </button>
                <div className="text-center max-w-[120px]">
                  <p className={cn(
                    "text-sm font-bold",
                    isActive && "text-primary",
                    isCompleted && !isActive && "text-gray-600",
                    !isActive && !isCompleted && "text-gray-400"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4 mb-8 transition-colors",
                  completedSteps.includes(step.id) ? "bg-primary" : "bg-gray-300"
                )} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

