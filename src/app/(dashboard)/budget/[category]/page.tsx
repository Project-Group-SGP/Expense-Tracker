import React from 'react'
import { Cardcontent } from '../../dashboard/_components/Card'
import { Category_Graph } from './_components/Category_Graph'
import Transaction from './_components/Transaction'

const page = () => {
  return (
    <div className='mt-20 ml-6 mr-6'>
      <section className="text-bl  grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <Cardcontent className="p-0 border-none">
              {/* pass Data and Name of the catagory */}
              <Category_Graph />
            </Cardcontent>
            <Cardcontent className="p-0">
                {/* pass Data and Name of the catagory */}
                <Transaction />
            </Cardcontent>
    </section>
    </div>
  )
}

export default page
