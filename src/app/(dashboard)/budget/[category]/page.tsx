import React, { cache } from 'react'
import { Cardcontent } from '../../dashboard/_components/Card'
import  {Category_Graph, Expenses}  from './_components/Category_Graph'
import Transaction from './_components/Transaction'
import { useRouter } from 'next/router'
// import { GetExpensesData } from './action'
import { usePathname } from 'next/navigation'
import { headers } from 'next/headers'

export const GetExpensesData = cache(async () => {
  const headersList = headers();
  const cookie = headersList.get('cookie') || '';
  
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/budget-category`,
      {
        method: 'GET',
        headers: { Cookie: cookie },
        // Including cache-related options in the request
        next: { tags: ['budget-data'] },
      }
    );

    const data = await response.json();
    return data.expenses;
  } catch (error) {
    console.error('Error fetching expenses data:', error);
    return {
      expense: [],
    };
  }
});

const page = async () => {

  const data:Expenses = await GetExpensesData();
  // console.log(data);
  
  
  return (
    <div className='mt-20 ml-6 mr-6'>
      <section className="text-bl  grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Cardcontent className="p-0 border-none">
              {/* pass Data and Name of the catagory */}
              <Category_Graph data = {data} />
            </Cardcontent>
            <Cardcontent className="p-0 border-none">
                {/* pass Data and Name of the catagory */}
                <Transaction data = {data}/>
            </Cardcontent>
    </section>
    </div>
  )
}

export default page
