import { headers } from "next/headers";
import BudgetSelection from "./_components/budget_Selection";
import { cache } from "react";

// Define interfaces for returned data
interface MonthlyData {
  month: string;
  totalIncome: number;
  totalExpense: number;
  categoryExpenses: Record<string, number>;
  categoryBudget: Record<string, number>;
  remainingBudget: number;
}

interface BudgetData {
  monthlyData: MonthlyData[];
}

interface Budget {
  budget: number;
}

// Ensure all categories are present with default values if missing
const ensureCategories = (data: BudgetData): BudgetData => {
  const allCategories = [
    "Other",
    "Bills",
    "Food",
    "Entertainment",
    "Transportation",
    "EMI",
    "Healthcare",
    "Education",
    "Investment",
    "Shopping",
    "Fuel",
    "Groceries",
  ];

  data.monthlyData.forEach((monthData) => {
    allCategories.forEach((category) => {
      if (!monthData.categoryExpenses.hasOwnProperty(category)) {
        monthData.categoryExpenses[category] = 0; // Default to zero if missing
      }
    });
  });

  return data;
};

// Cached fetch for budget category data
const fetchBudgetData = cache(async (): Promise<BudgetData> => {
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';

  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/budget-category`,
      {
        method: 'GET',
        headers: { Cookie: cookie },
        next: { tags: ['budget-category'] },
      }
    );
    
    const data: BudgetData = await response.json();
    return data; // Return the fetched and normalized data
  } catch (error) {
    console.error('Error fetching budget data:', error);
    return {
      monthlyData: [], // Return fallback empty data in case of an error
    };
  }
});

// Fetch budget data (not cached)
const fetchBudget = async (): Promise<Budget> => {
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';

  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/get-budget`,
      {
        method: 'GET',
        headers: { Cookie: cookie },
        next: { tags: ['budget'] },
      }
    );
    
    const data: Budget = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching budget:', error);
    return {
      budget: 0, // Return fallback value in case of an error
    };
  }
};

// Server Component Page
const Page = async () => {
  // let data = await fetchBudgetData();
  
  // const { budget } = await fetchBudget(); // Fetch the budget
  
  const [data, {budget}] = await Promise.all([fetchBudgetData(), fetchBudget()]);
  const data1 = ensureCategories(data); // Normalize the data

  return (
    <div className="mb-10 mr-10 mt-20">
      <BudgetSelection initialData={data1} budget={budget} />
    </div>
  );
};

export default Page;
