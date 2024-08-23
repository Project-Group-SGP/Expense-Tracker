'use server';

import { currentUserServer } from '@/lib/auth';
import { db } from '@/lib/db';
import { CategoryTypes } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';

//Set Budget
export async function SetBudgetDb(budget:number){
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';
  // check login or not
  const user = await currentUserServer();
  if (!user) {
    throw new Error("Login Please")
  }
  try{
      const result = await db.user.update({
        where: {
          id: user.id
        },
        data:{
          budget: budget
        }
      })
      revalidateTag("budget-data");
      return result ? "success" : "error";
  }catch(error){
    console.log("Error in SetBudget" + error);
    
  }
}



//fetch All Data
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