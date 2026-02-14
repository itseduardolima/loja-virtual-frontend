'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, useDayPicker, type MonthProps } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

/** Coloca Prev, label do mês e Next na mesma linha (header). */
function MonthWithHeaderRow(props: MonthProps) {
  const { displayIndex, className, style, children, ...rest } = props
  const { dayPickerProps } = useDayPicker()
  const numberOfMonths = dayPickerProps.numberOfMonths ?? 1
  const childList = React.Children.toArray(children)

  let prev: React.ReactNode = null
  let caption: React.ReactNode = null
  let next: React.ReactNode = null
  let restChildren: React.ReactNode[]

  if (numberOfMonths === 1) {
    prev = childList[0]
    caption = childList[1]
    next = childList[2]
    restChildren = childList.slice(3)
  } else if (displayIndex === 0) {
    prev = childList[0]
    caption = childList[1]
    restChildren = childList.slice(2)
  } else if (displayIndex === numberOfMonths - 1) {
    caption = childList[0]
    next = childList[1]
    restChildren = childList.slice(2)
  } else {
    caption = childList[0]
    restChildren = childList.slice(1)
  }

  return (
    <div className={className} style={style} {...rest}>
      <div className="flex flex-row items-center justify-between gap-2 h-10 border-b border-border mb-2 w-full min-w-0">
        <div className="w-8 shrink-0 flex justify-start">{prev}</div>
        <div className="flex-1 flex justify-center min-w-0">{caption}</div>
        <div className="w-8 shrink-0 flex justify-end">{next}</div>
      </div>
      {restChildren}
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout="around"
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-0',
        month_caption: 'contents',
        caption_label: 'text-sm font-medium',
        nav: 'flex items-center gap-1',
        button_previous: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 rounded-md opacity-70 hover:opacity-100'
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 rounded-md opacity-70 hover:opacity-100'
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: 'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected].day-range-middle)]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md'
        ),
        range_start: 'day-range-start bg-primary text-primary-foreground rounded-l-md ',
        range_end: 'day-range-end bg-primary text-primary-foreground rounded-r-md ',
        selected:
          '',
        today: '[&>button]:bg-accent [&>button]:text-accent-foreground rounded-md',
        outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Month: MonthWithHeaderRow,
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight
          return <Icon className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
