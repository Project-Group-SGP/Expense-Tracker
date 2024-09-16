'use server';

import { currentUserServer } from '@/lib/auth';
import { db } from '@/lib/db';
import { CategoryTypes } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';

// Convert string to CategoryTypes enum
function toCategoryType(category: string): CategoryTypes {
  if (Object.values(CategoryTypes).includes(category as CategoryTypes)) {
    return category as CategoryTypes;
  }
  return CategoryTypes.Other;
}

// Set or Update Category Budget
export async function SetCategoryBudgetDb(categoryId: string, budget: number) {
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';

  // Check login status
  const user = await currentUserServer();
  if (!user) {
    throw new Error("Please log in.");
  }

  try {
    const categoryType = toCategoryType(categoryId);

    // Check if the category exists for the user
    const existingCategory = await db.category.findFirst({
      where: {
        userId: user.id,
        category: categoryType
      }
    });

    if (existingCategory) {
      // Update existing category
      await db.category.update({
        where: {
          id: existingCategory.id // Use the existing category ID
        },
        data: {
          budget: budget
        }
      });
    } else {
      // Create new category
      await db.category.create({
        data: {
          userId: user.id,
          category: categoryType,
          budget: budget
        }
      });
    }

    // Revalidate cache tags
    revalidateTag("get-category-budget");
    revalidateTag("get-category-data");

    return "success";
  } catch (error) {
    console.error("Error in SetCategoryBudget:", error);
    throw new Error("Error setting category budget.");
  }
}


// set budget USER
export async function SetBudgetDb(budget: number) {
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';

  // Check login status
  const user = await currentUserServer();
  if (!user) {
    throw new Error("Please log in.");
  }

  try {
    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        budget: budget
      }
    });
    revalidateTag("get-category-budget");
    revalidateTag("get-category-data");
    return "success";
  } catch (error) {
    console.error("Error in SetBudget:", error);
    throw new Error("Error setting budget.");
  }
}