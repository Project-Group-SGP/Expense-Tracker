'use server';

import { currentUserServer } from '@/lib/auth';
import { db } from '@/lib/db';
import { CategoryTypes } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { toast } from 'sonner';

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

// setCategory Budget
export async function SetCategoryBudgetDb(categoryId: string, budget: number) { 
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';

  // Convert string to enum
  function toCategoryType(category: string): CategoryTypes {
    if (category in CategoryTypes) {
      return CategoryTypes[category as keyof typeof CategoryTypes];
    }
    return CategoryTypes.Other;
  }
  
  const categoryString: string = categoryId;
  const category: CategoryTypes = toCategoryType(categoryString);
  
  // Check login or not
  const user = await currentUserServer();
  if (!user) {
    throw new Error("Login Please");
  }
  
  try {
    // Check if the category exists
    const existingCategory = await db.category.findUnique({
      where: {
        id: categoryId
      }
    });
    
    if (existingCategory) {
      // Update existing category
      await db.category.update({
        where: {
          id: categoryId
        },
        data: {
          category: category,
          budget: budget
        }
      });
    } else {
      // Create new category
      await db.category.create({
        data: {
          id: categoryId,
          userId: user.id,
          category: category,
          budget: budget
        }
      });
    }
    
    // refresh cache
    revalidateTag("budget-category");
    return "success";
  } catch (error) {
    console.log("Error in SetCategoryBudget: " + error);
    // throw new Error("Error in SetCategoryBudget: " + error.message); // Propagate the error
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