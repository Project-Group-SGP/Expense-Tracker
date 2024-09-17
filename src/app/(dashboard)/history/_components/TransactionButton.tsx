"use client"
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Download, Upload } from "lucide-react"

export const TransactionButton = () => {
  const router = useRouter();

  const handleImport = () => router.push("/transaction")
  const handleExport = () => router.push("/report")
  return <>
    <div className="hidden sm:flex sm:gap-2">
      <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 w-[150px]"
                    onClick={handleImport}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add transactions via Bank Statement</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-purple-600 text-white hover:bg-purple-700 w-[150px]"
                    onClick={handleExport}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate Transaction's Report</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
      </div>
  </> 
}