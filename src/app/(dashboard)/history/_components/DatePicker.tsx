"use client";

import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { DatePickerWithRange } from '../../dashboard/_components/DatePickerWithRange';

const DatePicker = () => {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    const fetchJoininDate = async () => {
      try {
        const response = await fetch('/api/joinin-date');
        const data = await response.json();

        if (data.joininDate) {
          const joininDate = parseISO(data.joininDate);
          setDateRange({ from: joininDate, to: new Date() });

          const formattedStartDate = format(joininDate, 'yyyy-MM-dd');
          const formattedEndDate = format(new Date(), 'yyyy-MM-dd');

          router.push(`?from=${formattedStartDate}&to=${formattedEndDate}`, { scroll: false });
        }
      } catch (error) {
        console.error('Error fetching joinin date:', error);
      }
    };

    fetchJoininDate();
  }, [router]);

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

        router.push(`?from=${formattedStartDate}&to=${formattedEndDate}`, { scroll: false });
      }
    }
  };

  return (
    <DatePickerWithRange onDateRangeChange={handleDateRangeChange} defaultDateRange={dateRange} />
  );
};

export default DatePicker;