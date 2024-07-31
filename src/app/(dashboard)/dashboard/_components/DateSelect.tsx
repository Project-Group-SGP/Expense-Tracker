"use client";
import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { useState, useEffect } from 'react';
import { subMonths, format } from 'date-fns';
import { DatePickerWithRange } from './DatePickerWithRange';

const DateSelect = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  useEffect(() => {
    // Set initial date range on component mount
    const initialStartDate = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
    const initialEndDate = format(new Date(), 'yyyy-MM-dd');
    router.push(`?startDate=${initialStartDate}&endDate=${initialEndDate}`, { scroll: false });
  }, []);

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange) {
      if (!newDateRange.from) {
        newDateRange.from = newDateRange.to;
      } else if (!newDateRange.to) {
        newDateRange.to = newDateRange.from;
      }

      setDateRange(newDateRange);

      if (newDateRange.from && newDateRange.to) {
        const formattedStartDate = format(newDateRange.from, 'yyyy-MM-dd');
        const formattedEndDate = format(newDateRange.to, 'yyyy-MM-dd');

        router.push(`?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, { scroll: false });
      }
    }
  };

  return (
    <DatePickerWithRange onDateRangeChange={handleDateRangeChange} defaultDateRange={dateRange} />
  );
};

export default DateSelect;