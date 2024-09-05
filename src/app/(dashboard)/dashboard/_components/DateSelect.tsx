"use client"

import { useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"
import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { DatePickerWithRange } from "./DatePickerWithRange"
import { currentUserServer } from "@/lib/auth"

const DateSelect = () => {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  useEffect(() => {
    const fetchJoininDate = async () => {
      try {
        const user = await currentUserServer()
        const data = user?.joininDate

        if (data) {
          const joininDate = parseISO(data)
          setDateRange({ from: joininDate, to: new Date() })

          const formattedStartDate = format(joininDate, "yyyy-MM-dd")
          const formattedEndDate = format(new Date(), "yyyy-MM-dd")

          router.push(
            `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
            { scroll: false }
          )
        }
      } catch (error) {
        // console.error('Error fetching joinin date:', error);
      }
    }

    fetchJoininDate()
  }, [router])

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange) {
      if (!newDateRange.from) newDateRange.from = newDateRange.to
      else if (!newDateRange.to) newDateRange.to = newDateRange.from

      setDateRange(newDateRange)

      if (newDateRange.from && newDateRange.to) {
        const formattedStartDate = format(newDateRange.from, "yyyy-MM-dd")
        const formattedEndDate = format(newDateRange.to, "yyyy-MM-dd")

        router.push(
          `?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
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

export default DateSelect
