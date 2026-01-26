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
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id
          const isCompleted = completedSteps.includes(step.id)
          const isClickable = onStepClick && (isCompleted || index === 0 || completedSteps.includes(steps[index - 1]?.id))

          return (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-all mb-0 sm:mb-2",
                    "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12",
                    isActive && "border-primary bg-primary text-white",
                    isCompleted && !isActive && "border-primary bg-primary text-white",
                    !isActive && !isCompleted && "border-gray-300 bg-white text-gray-400",
                    isClickable && "cursor-pointer hover:scale-105",
                    !isClickable && "cursor-not-allowed opacity-50"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  ) : (
                    <span className="text-xs sm:text-sm lg:text-lg font-semibold">{step.id}</span>
                  )}
                </button>
                <div className="text-center w-full px-0.5 sm:px-1 hidden sm:block">
                  <p className={cn(
                    "text-xs sm:text-sm font-bold leading-tight break-words",
                    isActive && "text-primary",
                    isCompleted && !isActive && "text-gray-600",
                    !isActive && !isCompleted && "text-gray-400"
                  )}>
                    {step.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 hidden lg:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-1 sm:mx-2 lg:mx-4 mb-0 sm:mb-8 transition-colors flex-shrink-0",
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

