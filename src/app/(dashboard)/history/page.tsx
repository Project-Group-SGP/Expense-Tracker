"use client"
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

// async function getData(): Promise<Payment[]> {
//   // Fetch data from your API here.
//   return [
//     {
//       id: "728ed52f",
//       amount: 100,
//       status: "pending",
//       email: "m@example.com",
//     },
//     // ...
//   ]
// }

const data :Payment[] =[
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 500,
    status: "pending",
    email: "124wfsdm@example.com",
  },
  {
    id: "728ed52f",
    amount: 200,
    status: "pending",
    email: "m12312@example.com",
  },
]


const HistoryPage =  () => {
 
  return (
    <>
    <div className="text-red-500 text-2xl text-center font-semibold mt-20"> History </div>
    <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} filterKey="email" onDelete={()=>{
          return;
        }}/>
    </div>
    </>
  )
}

export default HistoryPage;