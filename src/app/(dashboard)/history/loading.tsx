"use server"
import DatePicker from "./_components/DatePicker"
import { NewExpense } from "./_components/Expance"
import { Newincome } from "./_components/Income"
import PageTitle from "./_components/PageTitle"
import { columns } from "./columns"
import { DataTable } from "./data-table"

const LOADINGPAGE = () => {
 
  return (
    <>
        <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
          <div className="mt-20 flex w-full flex-col gap-5 px-4">
            <PageTitle title="Transaction History" />
            <div className="flex w-full flex-wrap items-center justify-between gap-4"></div>
            <div className="flex justify-between">
              <DatePicker/>
              <div className="hidden sm:flex ml-auto gap-2">
                <Newincome />
                <NewExpense />
              </div>
            </div>
          </div>
          <div className="container mx-auto py-10 px-4">
            <DataTable 
              columns={columns} 
              data={[]} 
              filterKey="description" 
              disabled={true}
            />
          </div>      
        </div>
    </>
  )
}

export default LOADINGPAGE;
