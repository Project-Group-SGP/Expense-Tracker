import React from 'react'
import { Cardcontent } from '../../dashboard/_components/Card'
import  {Category_Graph, Expenses}  from './_components/Category_Graph'
import Transaction from './_components/Transaction'
import { useRouter } from 'next/router'
import { GetExpensesData } from './action'
import { usePathname } from 'next/navigation'

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
