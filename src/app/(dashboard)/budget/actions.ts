'use server';

import { headers } from 'next/headers';

interface BudgetData {
  totalIncome: number;
  budget: {
    budget: number;
  };
  perDayBudget: number;
  category: {
    [key: string]: number;
  };
}

export async function fetchBudgetData(): Promise<BudgetData> {
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';
  try{
    const response = await fetch(
        `${process.env.BASE_URL}/api/budget-category`,
        {
          method: 'GET',
          headers: { Cookie: cookie },
          next: { tags: ['budget-category'] },
        }
      );
      const data: BudgetData = await response.json();
      return data;
  }catch(error){
    console.error('Error fetching budget data:', error);
    return {
      totalIncome: 0,
      budget: { budget: 0 },
      perDayBudget: 0,
      category: {},
    };
  }
  
}