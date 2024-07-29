"use client";
import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { useState } from 'react';
import { subMonths } from 'date-fns';
import { DatePickerWithRange } from './DatePickerWithRange';

const DateSelect = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange) {
      if (!newDateRange.from) {
        newDateRange.from = newDateRange.to;
      } else if (!newDateRange.to) {
        newDateRange.to = newDateRange.from;
      }

      setDateRange(newDateRange);

      if (newDateRange.from && newDateRange.to) {
        const startDate = newDateRange.from.toISOString().split('T')[0];
        const endDate = newDateRange.to.toISOString().split('T')[0];
        router.push(`?startDate=${startDate}&endDate=${endDate}`, { scroll: false });
      }
    }
  };

  return (
    <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
  );
};

export default DateSelect;
