"use client"
import {
  format,
  subMonths,
  isBefore,
  startOfTomorrow,
  parseISO,
} from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"

export function DatePickerWithRange({
  className,
  onDateRangeChange,
  defaultDateRange,
}: React.HTMLAttributes<HTMLDivElement> & {
  onDateRangeChange?: (dateRange: DateRange | undefined) => void
  defaultDateRange?: DateRange
}) {
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: new Date(),
  })

  // ṣet start date to joing Date
  useEffect(() => {
    // Fetch the join date from the server
    const fetchJoinDate = async () => {
      try {
        const response = await fetch("/api/joinin-date", {
          method: "GET",
          next: { tags: ["joinin-date"] },
          cache: "force-cache",
        })
        const data = await response.json()

        console.log("Join date:", data)

        if (data.joininDate) {
          const joinDate = parseISO(data.joininDate)
          setDate({
            from: joinDate,
            to: new Date(),
          })
        }
      } catch (error) {
        // console.error('Error fetching join date:', error);
      }
    }

    fetchJoinDate()
  }, [])

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      if (!range.from) {
        range.from = range.to
      } else if (!range.to) {
        range.to = range.from
      }
      setDate(range)
    }
  }

  useEffect(() => {
    if (onDateRangeChange) {
      onDateRangeChange(date)
    }
  }, [date, onDateRangeChange])

  const disabledDays = {
    after: new Date(),
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={disabledDays}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
