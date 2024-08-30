import React from 'react'
import { Cardcontent } from '../../dashboard/_components/Card'
import { Category_Graph, Expenses } from './_components/Category_Graph'
import Transaction from './_components/Transaction'
import { headers } from 'next/headers'

// Fetch expenses data
export const GetExpensesData = async () => {
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';

  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/budget-category`,
      {
        method: 'GET',
        headers: { Cookie: cookie },
        next: { tags: ['budget-data'] },
      }
    );

    const data = await response.json();
    
    return { 
      expenses: data.expenses,
      categoryBudget: data.categoryBudget,
      totalIncome: data.totalIncome,
      perDayBudget: data.perDayBudget,
      totalExpense: data.totalExpense,
      category: data.category 
    };
  } catch (error) {
    console.error('Error fetching expenses data:', error);
    return {
      expenses: [],
      categoryBudget: {},
      totalIncome: 0,
      perDayBudget: 0,
      totalExpense: 0,
      category: {}
    };
  }
};

// Page component
const Page = async () => {
  const data = await GetExpensesData();
  // console.log(data);
  
  return (
    <div className='mt-20 ml-6 mr-6 pb-10'>
      <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {/* Set budget for a particular category */}
        <Cardcontent className="p-0 border-none">
          {/* Pass data to Category_Graph */}
          <Category_Graph data={data} />
        </Cardcontent>
        <Cardcontent className="p-0 border-none">
          {/* Pass data to Transaction */}
          <Transaction data={data} />
        </Cardcontent>
      </section>
    </div>
  )
}

export default Page;
