'use client'

import { columns } from "../columns"
import { DataTable } from "../data-table"
import { Showoptions } from "./showoptions"

interface HistoryPageProps {
  Data: any[]
}

export default function HistoryPage({ Data }: HistoryPageProps) {
  return (
    <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="mt-20 space-y-6">
        <Showoptions />
      </div>
      
      <div className="mt-8">
        <DataTable 
          columns={columns} 
          data={Data} 
          filterKey="description" 
          disabled={false}
        />
      </div>
    </div>
  )
}

// 'use client'
// import { useState } from "react"
// import { columns } from "../columns"
// import { DataTable } from "../data-table"
// import DatePicker from "./DatePicker"
// import { NewExpense } from "./Expance"
// import { Newincome } from "./Income"
// import { Showoptions } from "./showoptions"

// interface HistoryPageProps {
//   Data: any[]
// }

// export default function HistoryPage({ Data }: HistoryPageProps) {

//   return (
//     <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
//       <div className="mt-20 space-y-6">
//         <Showoptions/>

//         {/* Tablet/Desktop view */}
//         <div className="hidden sm:flex w-full flex-col md:flex-row items-start md:items-center justify-between gap-4">
//           <div className="w-full md:w-auto">
//             <DatePicker />
//           </div>
//           <div className="flex flex-wrap items-center gap-2">
//             <Newincome />
//             <NewExpense />
//           </div>
//         </div>
//       </div>
      
//       <div className="mt-8">
//         <DataTable 
//           columns={columns} 
//           data={Data} 
//           filterKey="description" 
//           disabled={false}
//         />
//       </div>
//     </div>
//   )
// }

// 'use client'

// import React, { useState } from "react"
// import { useRouter } from "next/navigation"
// import PageTitle from "./PageTitle"
// import { columns } from "../columns"
// import { DataTable } from "../data-table"
// import DatePicker from "./DatePicker"
// import { Newincome } from "./Income"
// import { NewExpense } from "./Expance"
// import { Button } from "@/components/ui/button"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"
// import { Download, Upload, CalendarIcon } from "lucide-react"

// interface HistoryPageProps {
//   Data: any[]
// }

// const HistoryPage: React.FC<HistoryPageProps> = ({ Data }) => {
//   const [isExpanded, setIsExpanded] = useState(false)
//   const router = useRouter()

//   const handleImport = () => {
//     router.push("/transaction")
//   }

//   const handleExport = () => {
//     router.push("/report")
//   }

//   return (
//     <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
//       <div className="mt-20 flex w-full flex-col gap-5 px-4">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
//           <PageTitle title="Transaction History" />
//           <Button
//             variant="outline"
//             className="w-full sm:hidden bg-gray-800 text-white hover:bg-gray-700"
//             onClick={() => setIsExpanded(!isExpanded)}
//           >
//             {isExpanded ? 'Hide Options' : 'Show Options'}
//           </Button>
//         </div>
        
//         {/* Mobile view */}
//         <div className={cn(
//           "flex flex-col space-y-4 sm:hidden transition-all duration-300 ease-in-out",
//           isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
//         )}>
//           <div className="bg-gray-800 p-4 rounded-lg">
//             <DatePicker />
//           </div>
//           <div className="bg-gray-800 p-4 rounded-lg space-y-2">
//             <Newincome />
//             <NewExpense />
//           </div>
//           <div className="bg-gray-800 p-4 rounded-lg space-y-2">
//             <Button
//               className="w-full bg-blue-600 text-white hover:bg-blue-700"
//               variant="outline"
//               onClick={handleImport}
//             >
//               <Upload className="mr-2 h-4 w-4" />
//               Import
//             </Button>
//             <Button
//               className="w-full bg-purple-600 text-white hover:bg-purple-700"
//               variant="outline"
//               onClick={handleExport}
//             >
//               <Download className="mr-2 h-4 w-4" />
//               Export
//             </Button>
//           </div>
//         </div>

//         {/* Tablet/Desktop view */}
//         <div className="hidden sm:flex w-full flex-wrap items-center justify-between gap-4">
//           <DatePicker />
//           <div className="flex items-center space-x-2">
//             <Newincome />
//             <NewExpense />
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     className="border-blue-500 text-blue-500 hover:bg-blue-700 hover:text-white"
//                     variant="outline"
//                     onClick={handleImport}
//                   >
//                     <Upload className="mr-2 h-4 w-4" />
//                     Import
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Add transactions via Bank Statement</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//             <TooltipProvider>
//               <Tooltip>
//                 <TooltipTrigger asChild>
//                   <Button
//                     className="border-purple-500 text-purple-500 hover:bg-purple-700 hover:text-white"
//                     variant="outline"
//                     onClick={handleExport}
//                   >
//                     <Download className="mr-2 h-4 w-4" />
//                     Export
//                   </Button>
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   <p>Generate Transaction's Report</p>
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>
//         </div>
//       </div>
      
//       <div className="container mx-auto py-10 px-4">
//         <DataTable 
//           columns={columns} 
//           data={Data} 
//           filterKey="description" 
//           disabled={false}
//         />
//       </div>      
//     </div>
//   )
// }
// export default HistoryPage
