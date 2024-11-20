// "use client"
// import { Button } from "@/components/ui/button";
// import { ChevronDown, ChevronUp, Download, Upload } from "lucide-react";
// import { useState } from "react";
// import PageTitle from "./PageTitle";
// import DatePicker from "./DatePicker";
// import { Newincome } from "./Income";
// import { NewExpense } from "./Expance";
// import { cn } from "@/lib/utils";
// import { useRouter } from "next/navigation";

// export const Showoptions = () => {
//   const [isExpanded, setIsExpanded] = useState<boolean>(false);
//   const router = useRouter();

//   const handleImport = () => router.push("/transaction")
//   const handleExport = () => router.push("/report")
//   return (
//     <>
//     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mt-20  w-full gap-5">
//           <PageTitle title="Transaction History" />
//     <Button
//             variant="outline"
//             className="w-full sm:hidden bg-primary text-primary-foreground hover:bg-primary/90"
//             onClick={() => setIsExpanded(!isExpanded)}
//           >
//             {isExpanded ? (
//               <>
//                 Hide Options
//                 <ChevronUp className="ml-2 h-4 w-4" />
//               </>
//             ) : (
//               <>
//                 Show Options
//                 <ChevronDown className="ml-2 h-4 w-4" />
//               </>
//             )}
//           </Button>
//         </div>
        
//         {/* Mobile view */}
//         <div className={cn(
//           "flex flex-col space-y-4 sm:hidden transition-all duration-300 ease-in-out",
//           isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
//         )}>
//           <div className="bg-card p-4 rounded-lg shadow-md flex justify-around gap-4">
//             <Newincome />
//             <NewExpense />
//           </div>
//           <div className="bg-card p-4 rounded-lg shadow-md flex justify-around gap-4">
//             <Button
//               className="w-full bg-blue-600 text-white hover:bg-blue-700"
//               onClick={handleImport}
//             >
//               <Upload className="mr-2 h-4 w-4" />
//               Import
//             </Button>
//             <Button
//               className="w-full bg-purple-600 text-white hover:bg-purple-700"
//               onClick={handleExport}
//             >
//               <Download className="mr-2 h-4 w-4" />
//               Export
//             </Button>
//           </div>
//         </div>
//         <div className="sm:hidden w-full md:w-auto">
//             <DatePicker />
//         </div>


'use client'

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Download, Upload } from 'lucide-react'
import { useState } from "react"
import PageTitle from "./PageTitle"
import DatePicker from "./DatePicker"
import { Newincome } from "./Income"
import { NewExpense } from "./Expance"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export const Showoptions = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const router = useRouter()

  const handleImport = () => router.push("/transaction")
  const handleExport = () => router.push("/report")

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 w-full gap-5">
        <PageTitle title="Transaction History" />
        <Button
          variant="outline"
          className="w-full sm:hidden bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Hide Options
              <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Options
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {/* Mobile view */}
      <div
        className={cn(
          "flex flex-col space-y-4 sm:hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="bg-card p-4 rounded-lg shadow-md flex justify-around gap-4">
          <Newincome />
          <NewExpense />
        </div>
        <div className="bg-card p-4 rounded-lg shadow-md flex justify-around gap-4">
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleImport}
          >
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Tablet/Desktop view */}
      <div className="sm:flex w-full flex-col md:flex-row items-start md:items-center justify-end gap-4 mt-6">
        <div className="w-full mt-4 ">
          <DatePicker />
        </div>
        <div className="hidden sm:flex gap-2 mt-4">
          <Newincome />
          <NewExpense />
        </div>
      </div>
    </>
  )
}