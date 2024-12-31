// // "use client"

// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from "@/components/ui/alert-dialog"
// // import { Button } from "@/components/ui/button"
// // import { cn } from "@/lib/utils"
// // import { Trash2 } from 'lucide-react'
// // import { useRouter } from "next/navigation"
// // import { useState } from "react"
// // import { toast } from "sonner"
// // import { deleteGroupTransaction } from "../group"

// // interface DeleteGroupTransactionButtonProps {
// //   transactionId: string
// //   groupId: string
// //   isCreator: boolean
// // }

// // export default function DeleteGroupTransactionButton({
// //   transactionId,
// //   groupId,
// //   isCreator,
// // }: DeleteGroupTransactionButtonProps) {
// //   const [isLoading, setIsLoading] = useState(false)
// //   const router = useRouter()

// //   const handleAction = async () => {
// //     if (isCreator) {
// //       setIsLoading(true)
// //       const loading = toast.loading("Deleting transaction...", {
// //         description: "Please wait while we process your request.",
// //       })

// //       try {
// //         let result = await deleteGroupTransaction(groupId, transactionId)

// //         if (result.error) {
// //           toast.error("Failed to delete the transaction. Please try again.", {
// //             closeButton: true,
// //             id: loading,
// //           })
// //           console.error(result.error)
// //         } else {
// //           toast.success("Transaction has been successfully deleted.", {
// //             closeButton: true,
// //             id: loading,
// //           })
// //           router.refresh()
// //         }
// //       } catch (error) {
// //         toast.error("An unexpected error occurred. Please try again.", {
// //           closeButton: true,
// //         })
// //         console.error(error)
// //       } finally {
// //         setIsLoading(false)
// //       }
// //     }
// //   }

// //   return (
// //     <AlertDialog>
// //       <AlertDialogTrigger asChild>
// //         <Button
// //           variant="outline"
// //           className={cn(
// //             "w-full sm:w-auto transition-colors duration-300",
// //             "border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
// //             "text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4"
// //           )}
// //           disabled={!isCreator}
// //         >
// //           <Trash2 className="hidden sm:block mr-1 h-4 w-4" /> 
// //           <span className="hidden sm:block">Delete</span>
// //           <span className="sm:hidden"><Trash2 className="h-5 w-5" /></span>
// //         </Button>
// //       </AlertDialogTrigger>
// //       <AlertDialogContent className="w-[95vw] max-w-md p-4 sm:w-full sm:max-w-lg sm:p-6">
// //         <AlertDialogHeader>
// //           <AlertDialogTitle className="flex items-center text-base sm:text-lg">
// //             <Trash2 className="mr-2 h-5 w-5 text-red-500" />
// //             Delete this transaction?
// //           </AlertDialogTitle>
// //           <AlertDialogDescription className="text-xs sm:text-sm">
// //             This action cannot be undone. The transaction will be permanently removed from the group.
// //           </AlertDialogDescription>
// //         </AlertDialogHeader>
// //         <AlertDialogFooter className="mt-4 flex-col gap-2 sm:mt-0 sm:flex-row sm:gap-0">
// //           <AlertDialogCancel
// //             disabled={isLoading}
// //             className="mb-2 w-full text-xs sm:mb-0 sm:w-auto sm:text-sm"
// //           >
// //             Cancel
// //           </AlertDialogCancel>
// //           <AlertDialogAction
// //             onClick={handleAction}
// //             className={cn(
// //               "w-full transition-colors duration-300 sm:w-auto",
// //               "bg-red-500 text-white hover:bg-red-600",
// //               "text-xs sm:text-sm"
// //             )}
// //             disabled={!isCreator || isLoading}
// //           >
// //             {isLoading ? (
// //               <>
// //                 <svg
// //                   className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
// //                   xmlns="http://www.w3.org/2000/svg"
// //                   fill="none"
// //                   viewBox="0 0 24 24"
// //                 >
// //                   <circle
// //                     className="opacity-25"
// //                     cx="12"
// //                     cy="12"
// //                     r="10"
// //                     stroke="currentColor"
// //                     strokeWidth="4"
// //                   ></circle>
// //                   <path
// //                     className="opacity-75"
// //                     fill="currentColor"
// //                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
// //                   ></path>
// //                 </svg>
// //                 Processing...
// //               </>
// //             ) : (
// //               "Delete transaction"
// //             )}
// //           </AlertDialogAction>
// //         </AlertDialogFooter>
// //       </AlertDialogContent>
// //     </AlertDialog>
// //   )
// // }

"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AlertTriangle, Trash2 } from 'lucide-react'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { deleteGroupTransaction } from "../group"

interface DeleteGroupTransactionButtonProps {
  transactionId: string
  groupId: string
  isCreator: boolean
  canDelete: boolean
}

export default function DeleteGroupTransactionButton({
  transactionId,
  groupId,
  isCreator,
  canDelete,
}: DeleteGroupTransactionButtonProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAction = async () => {
    if (isCreator && canDelete) {
      setIsLoading(true)
      const loading = toast.loading("Deleting transaction...", {
        description: "Please wait while we process your request.",
      })

      try {
        let result = await deleteGroupTransaction(groupId, transactionId)

        if (result.error) {
          toast.error("Failed to delete the transaction. Please try again.", {
            closeButton: true,
            id: loading,
          })
          console.error(result.error)
        } else {
          toast.success("Transaction has been successfully deleted.", {
            closeButton: true,
            id: loading,
          })
          router.refresh()
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.", {
          closeButton: true,
        })
        console.error(error)
      } finally {
        setIsLoading(false)
        setIsAlertOpen(false)
      }
    }
  }

  const getAlertContent = () => {
    if (isCreator && canDelete) {
      return {
        title: "Delete this transaction?",
        description: "This action cannot be undone. The transaction will be permanently removed from the group.",
        action: "Delete transaction",
        icon: <Trash2 className="h-6 w-6 text-red-500" />,
      }
    } else if (isCreator && !canDelete) {
      return {
        title: "Unable to delete",
        description: "This transaction cannot be deleted as it's part of an ongoing settlement.",
        action: "OK",
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      }
    } else {
      return {
        title: "Unable to delete",
        description: "Only the group creator can delete transactions.",
        action: "OK",
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      }
    }
  }

  const alertContent = getAlertContent()

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-auto transition-colors duration-300",
                isCreator && canDelete
                  ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  : "border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white",
                "text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4"
              )}
              onClick={() => setIsAlertOpen(true)}
            >
              {/* <Trash2 className="hidden sm:block mr-1 h-4 w-4" />
              <span className="hidden sm:block">Delete</span> */}
              {/* <span className="sm:hidden"> */}
                <Trash2 className="h-5 w-5" />
                {/* </span> */}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isCreator && canDelete
                ? "Delete this transaction"
                : isCreator && !canDelete
                  ? "Cannot delete ongoing settlement"
                  : "Only creator can delete"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="w-full max-w-[90vw] p-4 sm:max-w-lg sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-lg sm:text-xl">
              {alertContent.icon}
              <span className="ml-2">{alertContent.title}</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-col gap-2 sm:mt-0 sm:flex-row sm:gap-0">
            <AlertDialogCancel
              disabled={isLoading}
              className="mb-2 w-full sm:mb-0 sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={cn(
                "w-full transition-colors duration-300 sm:w-auto",
                isCreator && canDelete
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "cursor-not-allowed bg-gray-400 text-gray-100",
                "text-xs sm:text-sm"
              )}
              disabled={!isCreator || !canDelete || isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                alertContent.action
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// "use client"

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button"
// // Remove this import
// // import {
// //   Tooltip,
// //   TooltipContent,
// //   TooltipProvider,
// //   TooltipTrigger,
// // } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"
// import { AlertTriangle, Trash2 } from 'lucide-react'
// import { useRouter } from "next/navigation"
// import { useState } from "react"
// import { toast } from "sonner"
// import { deleteGroupTransaction } from "../group"

// interface DeleteGroupTransactionButtonProps {
//   transactionId: string
//   groupId: string
//   isCreator: boolean
//   canDelete: boolean
// }

// export default function DeleteGroupTransactionButton({
//   transactionId,
//   groupId,
//   isCreator,
//   canDelete,
// }: DeleteGroupTransactionButtonProps) {
//   const [isAlertOpen, setIsAlertOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleAction = async () => {
//     if (isCreator && canDelete) {
//       setIsLoading(true)
//       const loading = toast.loading("Deleting transaction...", {
//         description: "Please wait while we process your request.",
//       })

//       try {
//         let result = await deleteGroupTransaction(groupId, transactionId)

//         if (result.error) {
//           toast.error("Failed to delete the transaction. Please try again.", {
//             closeButton: true,
//             id: loading,
//           })
//           console.error(result.error)
//         } else {
//           toast.success("Transaction has been successfully deleted.", {
//             closeButton: true,
//             id: loading,
//           })
//           router.refresh()
//         }
//       } catch (error) {
//         toast.error("An unexpected error occurred. Please try again.", {
//           closeButton: true,
//         })
//         console.error(error)
//       } finally {
//         setIsLoading(false)
//         setIsAlertOpen(false)
//       }
//     }
//   }

//   const getAlertContent = () => {
//     if (isCreator && canDelete) {
//       return {
//         title: "Delete this transaction?",
//         description: "This action cannot be undone. The transaction will be permanently removed from the group.",
//         action: "Delete transaction",
//         icon: <Trash2 className="h-6 w-6 text-red-500" />,
//       }
//     } else if (isCreator && !canDelete) {
//       return {
//         title: "Unable to delete",
//         description: "This transaction cannot be deleted as it's part of an ongoing settlement.",
//         action: "OK",
//         icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
//       }
//     } else {
//       return {
//         title: "Unable to delete",
//         description: "Only the group creator can delete transactions.",
//         action: "OK",
//         icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
//       }
//     }
//   }

//   const alertContent = getAlertContent()

//   return (
//     <>
//       {/* Remove this section */}
//       {/* <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild> */}
//             <Button
//               variant="destructive"
//               className={cn(
//                 "w-full sm:w-auto transition-colors duration-300",
//                 "text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4"
//               )}
//               onClick={() => setIsAlertOpen(true)}
//               disabled={!isCreator || !canDelete}
//             >
//               <Trash2 className="hidden sm:inline-block mr-1 h-4 w-4" />
//               <span className="hidden sm:inline-block">Delete</span>
//               <span className="sm:hidden"><Trash2 className="h-5 w-5" /></span>
//             </Button>
//           {/* </TooltipTrigger>
//           <TooltipContent>
//             <p>
//               {isCreator && canDelete
//                 ? "Delete this transaction"
//                 : isCreator && !canDelete
//                   ? "Cannot delete ongoing settlement"
//                   : "Only creator can delete"}
//             </p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider> */}

//       <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
//         <AlertDialogContent className="w-full max-w-[90vw] p-4 sm:max-w-lg sm:p-6">
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center text-lg sm:text-xl">
//               {alertContent.icon}
//               <span className="ml-2">{alertContent.title}</span>
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-sm sm:text-base">
//               {alertContent.description}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className="mt-4 flex-col gap-2 sm:mt-0 sm:flex-row sm:gap-0">
//             <AlertDialogCancel
//               disabled={isLoading}
//               className="mb-2 w-full sm:mb-0 sm:w-auto"
//             >
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleAction}
//               className={cn(
//                 "w-full transition-colors duration-300 sm:w-auto",
//                 isCreator && canDelete
//                   ? "bg-red-500 text-white hover:bg-red-600"
//                   : "cursor-not-allowed bg-gray-400 text-gray-100",
//                 "text-xs sm:text-sm"
//               )}
//               disabled={!isCreator || !canDelete || isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <svg
//                     className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Processing...
//                 </>
//               ) : (
//                 alertContent.action
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   )
// }

