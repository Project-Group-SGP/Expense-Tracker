import Month_selection from "./_components/month_selection";
import { getCategoryBudget, getCategoryData } from "./action";

// Page component
const Page = async () => {


  const data = await getCategoryData("Food");
  
  const budget = await getCategoryBudget("Food");

  console.log("getCategoryData:", data);
  console.log("getCategoryBudget:", budget);
  
  return (<>
       <Month_selection  data={data} budget={budget} />
    </>  
  )
}

export default Page;
