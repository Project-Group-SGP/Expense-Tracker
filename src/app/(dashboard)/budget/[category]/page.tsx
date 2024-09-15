import { CategoryTypes } from "@prisma/client";
import Month_selection from "./_components/month_selection";
import { getCategoryBudget, getCategoryData } from "./action";
import { headers } from "next/headers";

// Page component
const Page = async ({ params: { category } } ) => {
  // const headersList = headers();
  // const cookie = headersList.get("cookie") || "";
  // const lastRouteName = headersList.get("category") || "";

  // console.log( "category : " + category);
  

  function toCategoryType(category: string): CategoryTypes {
    // Normalize the category string to upper case
    const normalizedCategory = category.trim().toLowerCase();
  
    // Create a map of normalized enum values for easy lookup
    const categoryMap: { [key: string]: CategoryTypes } = Object.values(CategoryTypes).reduce((map, key) => {
      map[key.toLowerCase()] = key as CategoryTypes;
      return map;
    }, {} as { [key: string]: CategoryTypes });
  
    // Return the matched enum value or default to CategoryTypes.Other
    return categoryMap[normalizedCategory] || CategoryTypes.Other;
  }
  
  
  const CategoryEnum = toCategoryType(category);
  // console.log("lastRouteName : " + CategoryEnum);
  

  // console.log("lastRouteName", lastRouteName);
  

  // Fetch data based on the last segment
  const data = await getCategoryData(CategoryEnum);
  const budget = await getCategoryBudget(CategoryEnum);

  return (
    <>
      <Month_selection data={data} budget={budget} />
    </>
  );
};

export default Page;
