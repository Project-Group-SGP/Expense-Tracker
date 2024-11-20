"use client"
import { format, parseISO } from "date-fns"
import { useRouter } from "next/navigation"
import { useState,useEffect } from "react"
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "../../dashboard/_components/DatePickerWithRange"

const DatePicker = () => {
  const router = useRouter()

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange) {
      if (!newDateRange.from) {
        newDateRange.from = newDateRange.to
      } else if (!newDateRange.to) {
        newDateRange.to = newDateRange.from
      }

      setDateRange(newDateRange)

      if (newDateRange.from && newDateRange.to) {
        const formattedStartDate = format(newDateRange.from, "yyyy-MM-dd")
        const formattedEndDate = format(newDateRange.to, "yyyy-MM-dd")

        router.push(
          `/history?from=${formattedStartDate}&to=${formattedEndDate}`,
          { scroll: false }
        )
      }
    }
  }

  return (
    <DatePickerWithRange
      onDateRangeChange={handleDateRangeChange}
      defaultDateRange={dateRange}
    />
  )
}

export default DatePicker
