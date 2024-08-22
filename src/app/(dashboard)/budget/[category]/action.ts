'use server';

import { CategoryTypes } from '@prisma/client';
import { headers } from 'next/headers';


export async function GetExpensesData() {
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
      

      return data.expenses;
  }catch(error){
    console.error('Error fetching expenses data:', error);
    return {
      expense:[],
    };
  }
  
}