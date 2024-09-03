"use client";

import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { DatePickerWithRange } from '../../dashboard/_components/DatePickerWithRange';
import { useCurrentUserClient } from '@/hooks/use-current-user';

const DatePicker = () => {
  const router = useRouter();
  const user = useCurrentUserClient();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
      try {
        if (user && user.joininDate) {
        const joininDate = parseISO(user.joininDate);
        setDateRange({ from: joininDate, to: new Date() });

        const formattedStartDate = format(joininDate, 'yyyy-MM-dd');
        const formattedEndDate = format(new Date(), 'yyyy-MM-dd');
        router.push(`?from=${formattedStartDate}&to=${formattedEndDate}`, { scroll: false });
       }
     } catch (error) {
      console.error('Error fetching joinin date:', error);
    }
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

        router.push(`/history?from=${formattedStartDate}&to=${formattedEndDate}`, { scroll: false });
      }
    }
  };

  return (
    <DatePickerWithRange onDateRangeChange={handleDateRangeChange} defaultDateRange={dateRange} />
  );
};

export default DatePicker;