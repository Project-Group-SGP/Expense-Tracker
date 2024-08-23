// This is a server component
import { fetchBudgetData } from "./actions";
import { OverallGraph } from "./_components/OverallGraph";
import CategoryList from "./_components/CategoryList";


const Page = async () => {
  const data = await fetchBudgetData();

  // console.log("Inside main Page.tsx");
  
  // console.log(data.expenses);
  
  return (
    <div className="mb-10 mr-10  mt-20">
      <OverallGraph
        totalIncome={data.totalIncome}
        budget={data.budget.budget}
        perDayBudget={data.perDayBudget}
        totalExpense = {data.totalExpense}
      />
      <CategoryList 
        categories={data.category}
      />
    </div>
  );
};

export default Page;
