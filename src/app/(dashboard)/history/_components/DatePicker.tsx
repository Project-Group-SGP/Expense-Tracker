"use client"

import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "../../dashboard/_components/DatePickerWithRange"

const DatePicker = () => {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // useEffect(() => {
  //   try {
  //     if (user && user.joininDate) {
  //       const joininDate = parseISO(user.joininDate)
  //       setDateRange({ from: joininDate, to: new Date() })

  //       const formattedStartDate = format(joininDate, "yyyy-MM-dd")
  //       const formattedEndDate = format(new Date(), "yyyy-MM-dd")
  //       router.push(`?from=${formattedStartDate}&to=${formattedEndDate}`, {
  //         scroll: false,
  //       })
  //     }
  //   } catch (error) {
  //     // console.error("Error n date:", error)
  //   }
  // }, [router])

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
