//when we update something in the database we need to refresh the data 

import { useCallback, useEffect, useState } from 'react';
import { getTotalExpense, getTotalIncome } from '../actions';

// it give me new total income and expense
export function useFinancialData() {
  const [totalIncome, setTotalIncome] = useState('Loading...');
  const [totalExpense, setTotalExpense] = useState('Loading...');

  const fetchData = useCallback(async () => {
    try {
      const income = await getTotalIncome();
      const expense = await getTotalExpense();
      setTotalIncome(income.toFixed(2));
      setTotalExpense(expense.toFixed(2));
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setTotalIncome('Error');
      setTotalExpense('Error');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { totalIncome, totalExpense, refreshData: fetchData };
}