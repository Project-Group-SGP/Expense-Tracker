// hooks/useFinancialData.ts
import { useState, useEffect, useCallback } from 'react';
import { getTotalIncome, getTotalExpense } from '../actions';

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