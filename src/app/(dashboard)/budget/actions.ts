'use server';

import { CategoryTypes } from '@prisma/client';
import { headers } from 'next/headers';


export async function fetchBudgetData() {
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
      const data = await response.json();
      // console.log("Inside action.ts");
      
      // console.log(data.expenses);
      // console.log(data);
      
      return data;
  }catch(error){
    console.error('Error fetching budget data:', error);
    return {
      totalIncome: 0,
      budget: { budget: 0 },
      perDayBudget: 0,
      category: {},
      expense:[],
    };
  }
  
}