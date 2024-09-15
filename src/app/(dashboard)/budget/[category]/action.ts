import { headers } from "next/headers";
import { cache } from "react";

export const getCategoryData = cache(async (category: string) => {
  try {
    const headersList = headers();
    const cookie = headersList.get('cookie') || '';
    const response = await fetch(`${process.env.BASE_URL}/api/get-category-data?category=${(category)}`, {
      method: 'GET',
      headers: { Cookie: cookie },
      next: { tags: ['get-category-data'] },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null or handle the error appropriately
  }
});

export const getCategoryBudget = cache(async (category: string) => {
  try {
    const headersList = headers();
    const cookie = headersList.get('cookie') || '';
    const response = await fetch(`${process.env.BASE_URL}/api/get-category-budget?category=${(category)}`, {
      method: 'GET',
      headers: { Cookie: cookie },
      next: { tags: ['get-category-budget'] },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null or handle the error appropriately
  }
})            