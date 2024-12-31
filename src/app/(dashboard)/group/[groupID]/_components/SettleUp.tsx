// "use client"

// import React, { useEffect, useMemo, useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { format } from "date-fns"
// import { CalendarIcon, HelpCircle, AlertTriangle, Info } from 'lucide-react'
// import { toast } from "sonner"
// import * as z from "zod"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"
// import { UserAvatar } from "./UserAvatar"
// import { settleUp } from "../group"
// import { useRouter } from "next/navigation"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// interface GroupMember {
//   userId: string
//   name: string
//   avatar: string
// }

// interface TransactionSummary {
//   member: {
//     id: string;
//     name: string;
//   };
//   transactions: {
//     payable: {
//       id: string;
//       amount: number;
//       expense: {
//         id: string;
//         description: string;
//       };
//     }[];
//     receivable: {
//       id: string;
//       amount: number;
//       expense: {
//         id: string;
//         description: string;
//       };
//     }[];
//   };
//   summary: {
//     totalPayable: number;
//     totalReceivable: number;
//     netBalance: number;
//     balanceStatus: "receivable" | "payable";
//   };
// }

// const formSchema = z.object({
//   fromUser: z.string().min(1, "Please select a valid payer."),
//   toUser: z.string().min(1, "Please select a valid recipient."),
//   selectedExpenses: z.array(z.string()),
//   // transactionDate: z.date({
//   //   required_error: "Please select a date",
//   // }).refine((date) => date <= new Date(), {
//   //   message: "Transaction date cannot be in the future",
//   // }),
//   isNetSettlement: z.boolean().default(false),
// })

// type FormSchema = z.infer<typeof formSchema>

// interface SettleUpProps {
//   groupMemberName: GroupMember[]
//   settleup: TransactionSummary[]
//   user: string
//   params: { groupID: string }
// }

// export const UserSelectionModal: React.FC<{
//   isOpen: boolean
//   onClose: () => void
//   onSelect: (user: GroupMember) => void
//   availableUsers: GroupMember[]
// }> = ({ isOpen, onClose, onSelect, availableUsers }) => {
//   if (!isOpen) return null

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-[425px] rounded-lg">
//         <DialogHeader>
//           <DialogTitle>Select Member</DialogTitle>
//         </DialogHeader>
//         <div className="max-h-[50vh] overflow-y-auto pb-5">
//           {availableUsers.length === 0 ? (
//             <div className="flex items-center justify-center py-4">
//               <span className="text-sm text-gray-500">No users available</span>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 gap-4">
//               {availableUsers.map((user) => (
//                 <Button
//                   key={user.userId}
//                   variant="outline"
//                   className="flex h-full items-center justify-start space-x-2 p-2"
//                   onClick={(e) => {
//                     e.stopPropagation()
//                     onSelect(user)
//                     onClose()
//                   }}
//                 >
//                   <UserAvatar user={user} size={40} />
//                   <span className="truncate text-sm">{user.name}</span>
//                 </Button>
//               ))}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// interface ExpenseCardProps {
//   expense: {
//     id: string;
//     amount: number;
//     expense: {
//       id: string;
//       description: string;
//     };
//   };
//   type: 'payable' | 'receivable';
//   selectedExpenses: string[];
//   onExpenseChange: (value: string[]) => void;
//   user: GroupMember;
//   disabled: boolean;
// }

// const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, type, selectedExpenses, onExpenseChange, user, disabled }) => {
//   const isChecked = disabled ? false : selectedExpenses?.includes(expense.id)

//   const handleCheckboxChange = (checked: boolean) => {
//     if (disabled) return
//     const updatedExpenses = checked
//       ? [...selectedExpenses, expense.id]
//       : selectedExpenses.filter((id) => id !== expense.id)
    
//     onExpenseChange(updatedExpenses)
//   }

//   return (
//     <div className={`flex min-h-[8vh] items-center justify-between rounded-lg border p-3 shadow-sm transition-all hover:shadow-md sm:p-4 mt-2
//       ${type === 'payable' 
//         ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' 
//         : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' }
//       ` }
//       role="listitem"
//     >
//       <div className="flex items-center flex-grow pr-2">
//         <UserAvatar user={user} size={48} />
//         <div className="ml-3">
//           <p className="truncate text-sm font-semibold sm:text-base dark:text-gray-200">
//             {expense.expense.description}
//           </p>
//           <p className={`text-xs sm:text-sm font-medium 
//             ${type === 'payable' 
//               ? 'text-red-600 dark:text-red-400' 
//               : 'text-green-600 dark:text-green-400'}`}>
//             {type === 'payable' ? 'You owe' : 'You are owed'}: ₹{expense.amount.toLocaleString('en-IN')}
//           </p>
//         </div>
//       </div>
//       {type === 'payable' && (
//         <div>
//           <Checkbox
//             checked={isChecked}
//             onCheckedChange={handleCheckboxChange}
//             disabled={disabled}
//             className="h-5 w-5 text-red-500 border-red-300 rounded dark:border-red-700 dark:text-red-400"
//             aria-label={`Select ${expense.expense.description} expense`}
//           />
//         </div>
//       )}
//     </div>
//   )
// }

// const formatAmount = (amount: number | undefined) => {
//   if (amount === undefined) return 0
//   return Math.abs(amount).toLocaleString('en-IN')
// }

// export function SettleUp({
//   groupMemberName,
//   settleup,
//   user,
//   params: { groupID },
// }: SettleUpProps) {
//   const [open, setOpen] = useState(false)
//   const [showConfirmation, setShowConfirmation] = useState(false)
//   const [selectedData, setSelectedData] = useState<FormSchema | null>(null)
//   const [activeTab, setActiveTab] = useState<'pay' | 'receive'>('pay')
//   const [isSettling, setIsSettling] = useState(false)

//   const form = useForm<FormSchema>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       fromUser: user,
//       toUser: settleup[0]?.member.id ?? '',
//       selectedExpenses: [],
//       // transactionDate: new Date(),
//       isNetSettlement: false,
//     },
//   })

//   const handleSubmit = async (data: FormSchema) => {
//     setSelectedData(data)
//     setShowConfirmation(true)
//   }

//   const confirmAndSettle = async () => {
//     if (!selectedData) return
//     setShowConfirmation(false)
//     setIsSettling(true)
    
//     try {
//       await settleUp({
//         ...selectedData,
//         groupID,
//         isNetSettle: selectedData.isNetSettlement,
//       })
      
//       toast.success("Successfully settled up!", {
//         description: `Settlement of ₹${formatAmount(totalAmount)} completed`,
//         icon: "🤝",
//         duration: 4500,
//       })
      
//       form.reset()
//       setOpen(false)
//     } catch (error) {
//       toast.error("Failed to settle up", {
//         description: error instanceof Error ? error.message : "An unknown error occurred",
//       })
//     } finally {
//       setIsSettling(false)
//     }
//   }

//   const toUser = form.watch("toUser")
//   const selectedExpenses = form.watch("selectedExpenses")
//   const isNetSettlement = form.watch("isNetSettlement")

//   const currentUserSummary = useMemo(() =>
//     settleup.find((summary) => summary.member.id === toUser),
//     [settleup, toUser]
//   )

//   const [userSelectionOpen, setUserSelectionOpen] = useState(false)
//   const [selectingFor, setSelectingFor] = useState<"fromUser" | "toUser" | null>(null)

//   const handleUserSelect = (selectedUser: GroupMember) => {
//     if (selectingFor === "toUser") {
//       form.setValue("toUser", selectedUser.userId)
//       form.setValue("selectedExpenses", [])
//     }
//     setUserSelectionOpen(false)
//   }

//   const selectedUserTransactions = useMemo(() => {
//     if (!toUser || !currentUserSummary) return { payable: [], receivable: [] }
//     return currentUserSummary.transactions
//   }, [currentUserSummary, toUser])

//   const totalAmount = useMemo(() => {
//     if (isNetSettlement && currentUserSummary) {
//       return Math.abs(currentUserSummary.summary.netBalance)
//     }
//     return selectedExpenses.reduce((sum, expenseId) => {
//       const payable = selectedUserTransactions.payable.find(
//         (t) => t.id === expenseId
//       )
//       return sum + (payable ? payable.amount : 0)
//     }, 0)
//   }, [selectedUserTransactions, selectedExpenses, currentUserSummary, isNetSettlement])

//   if (settleup.length === 0) {
//     return (
//       <TooltipProvider>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button
//               className="w-full sm:w-[150px]"
//               variant="outline"
//               disabled
//             >
//               Settle up 🤝
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent>
//             <p>There are no pending transactions to settle</p>
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider>
//     )
//   }

//   const isSettlementDisabled = !toUser || 
//     (!isNetSettlement && selectedExpenses.length === 0) || 
//     (isNetSettlement && currentUserSummary?.summary.balanceStatus === "receivable")

//   return (
//     <>
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button
//             className="w-full rounded-lg border-green-500 text-green-500 hover:bg-green-700 hover:text-white sm:w-[150px]"
//             variant="outline"
//           >
//             Settle up 🤝
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto rounded-lg sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle className="flex items-center justify-center gap-2 sm:justify-start">
//               <span className="text-green-500">Settle up</span> 🤝
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <HelpCircle className="h-4 w-4" />
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Select expenses to settle or use net settlement</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </DialogTitle>
//           </DialogHeader>

//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
//               <div className="flex items-center justify-center flex-row space-x-4 space-y-0">
//                 <UserAvatar
//                   user={
//                     groupMemberName.find((u) => u.userId === user) ||
//                     groupMemberName[0]
//                   }
//                   size={85}
//                 />
//                 <div className="transform text-2xl rotate-0" aria-hidden="true">→</div>
//                 <FormField
//                   control={form.control}
//                   name="toUser"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormControl>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           className="h-24 w-24 rounded-full border-none p-0"
//                           onClick={() => {
//                             setSelectingFor("toUser")
//                             setUserSelectionOpen(true)
//                           }}
//                           aria-label="Select recipient"
//                         >
//                           <UserAvatar
//                             user={
//                               groupMemberName.find(
//                                 (u) => u.userId === field.value
//                               ) || { userId: "", name: "Select", avatar: "" }
//                             }
//                             size={85}
//                           />
//                         </Button>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="text-center" aria-live="polite">
//                 <span className="text-green-500">
//                   {groupMemberName.find((u) => u.userId === user)?.name}
//                 </span>{" "}
//                 paid{" "}
//                 <span className="text-blue-500">
//                   {groupMemberName.find((u) => u.userId === form.watch("toUser"))
//                     ?.name || "Select recipient"}
//                 </span>
//               </div>
              
//               {/* <FormField
//                 control={form.control}
//                 name="transactionDate"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Transaction Date</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={"outline"}
//                             className={cn(
//                               "w-full pl-3 text-left font-normal",
//                               !field.value && "text-muted-foreground"
//                             )}
//                           >
//                             {field.value ? format(field.value, "PPP") : "Pick a date"}
//                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           disabled={(date) =>
//                             date > new Date() || date < new Date("1900-01-01")
//                           }
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )} 
//               />*/}

//               <FormField
//                 control={form.control}
//                 name="isNetSettlement"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-1">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         aria-label="Enable net settlement"
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none flex flex-row items-center">
//                       <FormLabel className="cursor-pointer">
//                         Net Settlement
//                       </FormLabel>
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Info className="h-4 w-4 ml-2" />
//                           </TooltipTrigger>
//                           <TooltipContent>
//                             <p>Settle the net balance instead of individual expenses</p>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     </div>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="selectedExpenses"
//                 render={() => (
//                   <FormItem>
//                     <Tabs 
//                       value={activeTab} 
//                       onValueChange={(value) => setActiveTab(value as 'pay' | 'receive')} 
//                       className="w-full"
//                     >
//                       <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="pay">Pay</TabsTrigger>
//                         <TabsTrigger value="receive">Receive</TabsTrigger>
//                       </TabsList>
//                       <div>
//                         {activeTab === 'pay' && (
//                           <div 
//                             className={`grid grid-cols-1 content-start gap-2 ${
//                               selectedUserTransactions.payable.length < 3 ? "" : "max-h-[30vh] sm:max-h-[40vh]"
//                             } overflow-y-auto`}
//                             role="list"
//                             aria-label="Payable expenses"
//                           >
//                             {selectedUserTransactions.payable.map((expense) => (
//                               <ExpenseCard
//                                 key={expense.id}
//                                 expense={expense}
//                                 type="payable"
//                                 selectedExpenses={form.watch("selectedExpenses")}
//                                 onExpenseChange={(value) => form.setValue("selectedExpenses", value)}
//                                 user={groupMemberName.find(u => u.userId === toUser) || groupMemberName[0]}
//                                 disabled={isNetSettlement}
//                               />
//                             ))}
//                           </div>
//                         )}
//                         {activeTab === 'receive' && (
//                           <div 
//                             className={`grid grid-cols-1 content-start gap-2 ${
//                               selectedUserTransactions.receivable.length < 3 ? "" : "max-h-[30vh] sm:max-h-[40vh]"
//                             } overflow-y-auto`}
//                             role="list"
//                             aria-label="Receivable expenses"
//                           >
//                             {selectedUserTransactions.receivable.map((expense) => (
//                               <ExpenseCard
//                                 key={expense.id}
//                                 expense={expense}
//                                 type="receivable"
//                                 selectedExpenses={form.watch("selectedExpenses")}
//                                 onExpenseChange={(value) => form.setValue("selectedExpenses", value)}
//                                 user={groupMemberName.find(u => u.userId === toUser) || groupMemberName[0]}
//                                 disabled={isNetSettlement}
//                               />
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </Tabs>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
//                 {currentUserSummary && (
//                   <>
//                     <div 
//                       className={`w-full text-center text-lg font-semibold sm:w-auto sm:text-left ${
//                         isNetSettlement
//                           ? currentUserSummary?.summary.balanceStatus === "receivable"
//                             ? 'text-green-500 dark:text-green-400'
//                             : 'text-red-500 dark:text-red-400'
//                           : 'text-blue-500 dark:text-blue-400'
//                       }`}
//                       aria-live="polite"
//                     >
//                       Total: ₹{formatAmount(totalAmount)}
//                     </div>
//                     <div className="flex w-full flex-col justify-center space-y-2 sm:w-auto sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Button
//                               type="submit"
//                               variant="outline"
//                               className="w-full rounded-lg border-green-500 text-green-500 hover:bg-green-600 hover:text-white sm:w-auto"
//                               disabled={isSettlementDisabled || isSettling}
//                             >
//                               {isSettling 
//                                 ? "Settling..." 
//                                 : isNetSettlement 
//                                   ? "Net Settle" 
//                                   : "Settle Selected"
//                               }
//                             </Button>
//                           </TooltipTrigger>
//                           <TooltipContent>
//                             <p>
//                               {isNetSettlement
//                                 ? `Net settle: ₹${formatAmount(Math.abs(currentUserSummary?.summary.netBalance ?? 0))}`
//                                 : `Settle selected: ₹${formatAmount(totalAmount)}`}
//                             </p>
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <AlertTriangle className="h-5 w-5 text-yellow-500" />
//               Confirm Settlement
//             </DialogTitle>
//             <DialogDescription>
//               Are you sure you want to settle {isNetSettlement ? "the net balance" : "the selected expenses"}?
//               This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="flex justify-end space-x-2 pt-4">
//             <Button
//               variant="outline"
//               onClick={() => setShowConfirmation(false)}
//               disabled={isSettling}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={confirmAndSettle}
//               className="bg-green-500 text-white hover:bg-green-600"
//               disabled={isSettling}
//             >
//               {isSettling ? "Settling..." : "Confirm Settlement"}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <UserSelectionModal
//         isOpen={userSelectionOpen}
//         onClose={() => setUserSelectionOpen(false)}
//         onSelect={handleUserSelect}
//         availableUsers={groupMemberName.filter((member) => member.userId !== user)}
//       />
//     </>
//   )
// }

// export default SettleUp

"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, HelpCircle, AlertTriangle, Info } from 'lucide-react'
import { toast } from "sonner"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { UserAvatar } from "./UserAvatar"
import { settleUp } from "../group"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GroupMember {
  userId: string
  name: string
  avatar: string
}

interface TransactionSummary {
  member: {
    id: string;
    name: string;
  };
  transactions: {
    payable: {
      id: string;
      amount: number;
      expense: {
        id: string;
        description: string;
      };
    }[];
    receivable: {
      id: string;
      amount: number;
      expense: {
        id: string;
        description: string;
      };
    }[];
  };
  summary: {
    totalPayable: number;
    totalReceivable: number;
    netBalance: number;
    balanceStatus: "receivable" | "payable";
  };
}

const formSchema = z.object({
  fromUser: z.string().min(1, "Please select a valid payer."),
  toUser: z.string().min(1, "Please select a valid recipient."),
  selectedExpenses: z.array(z.string()),
  // transactionDate: z.date({
  //   required_error: "Please select a date",
  // }).refine((date) => date <= new Date(), {
  //   message: "Transaction date cannot be in the future",
  // }),
  isNetSettlement: z.boolean().default(false),
})

type FormSchema = z.infer<typeof formSchema>

interface SettleUpProps {
  groupMemberName: GroupMember[]
  settleup: TransactionSummary[]
  user: string
  params: { groupID: string }
}

export const UserSelectionModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSelect: (user: GroupMember) => void
  availableUsers: GroupMember[]
}> = ({ isOpen, onClose, onSelect, availableUsers }) => {
  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle>Select Member</DialogTitle>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto pb-5">
          {availableUsers.length === 0 ? (
            <div className="flex items-center justify-center py-4">
              <span className="text-sm text-gray-500">No users available</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {availableUsers.map((user) => (
                <Button
                  key={user.userId}
                  variant="outline"
                  className="flex h-full items-center justify-start space-x-2 p-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(user)
                    onClose()
                  }}
                >
                  <UserAvatar user={user} size={40} />
                  <span className="truncate text-sm">{user.name}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ExpenseCardProps {
  expense: {
    id: string;
    amount: number;
    expense: {
      id: string;
      description: string;
    };
  };
  type: 'payable' | 'receivable';
  selectedExpenses: string[];
  onExpenseChange: (value: string[]) => void;
  user: GroupMember;
  disabled: boolean;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, type, selectedExpenses, onExpenseChange, user, disabled }) => {
  const isChecked = disabled ? false : selectedExpenses?.includes(expense.id)

  const handleCheckboxChange = (checked: boolean) => {
    if (disabled) return
    const updatedExpenses = checked
      ? [...selectedExpenses, expense.id]
      : selectedExpenses.filter((id) => id !== expense.id)
    
    onExpenseChange(updatedExpenses)
  }

  return (
    <div className={`flex min-h-[8vh] items-center justify-between rounded-lg border p-3 shadow-sm transition-all hover:shadow-md sm:p-4 mt-2
      ${type === 'payable' 
        ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' 
        : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' }
      ` }
      role="listitem"
    >
      <div className="flex items-center flex-grow pr-2">
        <UserAvatar user={user} size={48} />
        <div className="ml-3">
          <p className="truncate text-sm font-semibold sm:text-base dark:text-gray-200">
            {expense.expense.description}
          </p>
          <p className={`text-xs sm:text-sm font-medium 
            ${type === 'payable' 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-green-600 dark:text-green-400'}`}>
            {type === 'payable' ? 'You owe' : 'You are owed'}: ₹{expense.amount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      {type === 'payable' && (
        <div>
          <Checkbox
            checked={isChecked}
            onCheckedChange={handleCheckboxChange}
            disabled={disabled}
            className="h-5 w-5 text-red-500 border-red-300 rounded dark:border-red-700 dark:text-red-400 data-[state=checked]:bg-red-200 data-[state=checked]:dark:bg-red-950"
            aria-label={`Select ${expense.expense.description} expense`}
          />
        </div>
      )}
    </div>
  )
}

const formatAmount = (amount: number | undefined) => {
  if (amount === undefined || isNaN(amount)) return 0
  return Number(Math.abs(amount)).toLocaleString('en-IN')
}

export function SettleUp({
  groupMemberName,
  settleup,
  user,
  params: { groupID },
}: SettleUpProps) {
  const [open, setOpen] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedData, setSelectedData] = useState<FormSchema | null>(null)
  const [activeTab, setActiveTab] = useState<'pay' | 'receive'>('pay')
  const [isSettling, setIsSettling] = useState(false)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromUser: user,
      toUser: settleup[0]?.member.id ?? '',
      selectedExpenses: [],
      // transactionDate: new Date(),
      isNetSettlement: false,
    },
  })

  const handleSubmit = async (data: FormSchema) => {
    setSelectedData(data)
    setShowConfirmation(true)
  }

  const confirmAndSettle = async () => {
    if (!selectedData) return
    setShowConfirmation(false)
    setIsSettling(true)
    
    try {
      await settleUp({
        ...selectedData,
        groupID,
        isNetSettle: selectedData.isNetSettlement,
      })
      
      toast.success("Successfully settled up!", {
        description: `Settlement of ₹${formatAmount(totalAmount)} completed`,
        icon: "🤝",
        duration: 4500,
      })
      
      form.reset()
      setOpen(false)
    } catch (error) {
      toast.error("Failed to settle up", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSettling(false)
    }
  }

  const toUser = form.watch("toUser")
  const selectedExpenses = form.watch("selectedExpenses")
  const isNetSettlement = form.watch("isNetSettlement")

  const currentUserSummary = useMemo(() =>
    settleup.find((summary) => summary.member.id === toUser),
    [settleup, toUser]
  )

  const [userSelectionOpen, setUserSelectionOpen] = useState(false)
  const [selectingFor, setSelectingFor] = useState<"fromUser" | "toUser" | null>(null)

  const handleUserSelect = (selectedUser: GroupMember) => {
    if (selectingFor === "toUser") {
      form.setValue("toUser", selectedUser.userId)
      form.setValue("selectedExpenses", [])
    }
    setUserSelectionOpen(false)
  }

  const selectedUserTransactions = useMemo(() => {
    if (!toUser || !currentUserSummary) return { payable: [], receivable: [] }
    return currentUserSummary.transactions
  }, [currentUserSummary, toUser])

  const totalAmount = useMemo(() => {
    if (isNetSettlement && currentUserSummary) {
      return Math.abs(currentUserSummary.summary.netBalance)
    }
    return selectedExpenses.reduce((sum, expenseId) => {
      const payable = selectedUserTransactions.payable.find(
        (t) => t.id === expenseId
      )
      // Ensure numerical addition by converting to number
      return Number(sum) + Number(payable?.amount || 0)
    }, 0)
  }, [selectedUserTransactions, selectedExpenses, currentUserSummary, isNetSettlement])

  if (settleup.length === 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-full sm:w-[150px]"
              variant="outline"
              disabled
            >
              Settle up 🤝
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>There are no pending transactions to settle</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const isSettlementDisabled = !toUser || 
    (!isNetSettlement && selectedExpenses.length === 0) || 
    (isNetSettlement && currentUserSummary?.summary.balanceStatus === "receivable")

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full rounded-lg border-green-500 text-green-500 hover:bg-green-700 hover:text-white sm:w-[150px]"
            variant="outline"
          >
            Settle up 🤝
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto rounded-lg sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="text-green-500">Settle up</span> 🤝
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select expenses to settle or use net settlement</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="flex items-center justify-center flex-row space-x-4 space-y-0">
                <UserAvatar
                  user={
                    groupMemberName.find((u) => u.userId === user) ||
                    groupMemberName[0]
                  }
                  size={85}
                />
                <div className="transform text-2xl rotate-0" aria-hidden="true">→</div>
                <FormField
                  control={form.control}
                  name="toUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-24 w-24 rounded-full border-none p-0"
                          onClick={() => {
                            setSelectingFor("toUser")
                            setUserSelectionOpen(true)
                          }}
                          aria-label="Select recipient"
                        >
                          <UserAvatar
                            user={
                              groupMemberName.find(
                                (u) => u.userId === field.value
                              ) || { userId: "", name: "Select", avatar: "" }
                            }
                            size={85}
                          />
                        </Button>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-center" aria-live="polite">
                <span className="text-green-500">
                  {groupMemberName.find((u) => u.userId === user)?.name}
                </span>{" "}
                paid{" "}
                <span className="text-blue-500">
                  {groupMemberName.find((u) => u.userId === form.watch("toUser"))
                    ?.name || "Select recipient"}
                </span>
              </div>
              
              {/* <FormField
                control={form.control}
                name="transactionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Transaction Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} 
              />*/}

              <FormField
                control={form.control}
                name="isNetSettlement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-label="Enable net settlement"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none flex flex-row items-center">
                      <FormLabel className="cursor-pointer flex items-center">
                        Net Settlement
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Settle the net balance instead of individual expenses</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selectedExpenses"
                render={() => (
                  <FormItem>
                    <Tabs 
                      value={activeTab} 
                      onValueChange={(value) => setActiveTab(value as 'pay' | 'receive')} 
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="pay">Pay</TabsTrigger>
                        <TabsTrigger value="receive">Receive</TabsTrigger>
                      </TabsList>
                      <div>
                        {activeTab === 'pay' && (
                          <div 
                            className={`grid grid-cols-1 content-start gap-2 ${
                              selectedUserTransactions.payable.length < 3 ? "" : "max-h-[30vh] sm:max-h-[40vh]"
                            } overflow-y-auto`}
                            role="list"
                            aria-label="Payable expenses"
                          >
                            {selectedUserTransactions.payable.map((expense) => (
                              <ExpenseCard
                                key={expense.id}
                                expense={expense}
                                type="payable"
                                selectedExpenses={form.watch("selectedExpenses")}
                                onExpenseChange={(value) => form.setValue("selectedExpenses", value)}
                                user={groupMemberName.find(u => u.userId === toUser) || groupMemberName[0]}
                                disabled={isNetSettlement}
                              />
                            ))}
                          </div>
                        )}
                        {activeTab === 'receive' && (
                          <div 
                            className={`grid grid-cols-1 content-start gap-2 ${
                              selectedUserTransactions.receivable.length < 3 ? "" : "max-h-[30vh] sm:max-h-[40vh]"
                            } overflow-y-auto`}
                            role="list"
                            aria-label="Receivable expenses"
                          >
                            {selectedUserTransactions.receivable.map((expense) => (
                              <ExpenseCard
                                key={expense.id}
                                expense={expense}
                                type="receivable"
                                selectedExpenses={form.watch("selectedExpenses")}
                                onExpenseChange={(value) => form.setValue("selectedExpenses", value)}
                                user={groupMemberName.find(u => u.userId === toUser) || groupMemberName[0]}
                                disabled={isNetSettlement}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </Tabs>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-x-2 sm:space-y-0">
                {currentUserSummary && (
                  <>
                    <div 
                      className={`w-full text-center text-lg font-semibold sm:w-auto sm:text-left ${
                        isNetSettlement
                          ? currentUserSummary?.summary.balanceStatus === "receivable"
                            ? 'text-green-500 dark:text-green-400'
                            : 'text-red-500 dark:text-red-400'
                          : 'text-blue-500 dark:text-blue-400'
                      }`}
                      aria-live="polite"
                    >
                      Total: ₹{formatAmount(totalAmount)}
                    </div>
                    <div className="flex w-full flex-col justify-center space-y-2 sm:w-auto sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="submit"
                              variant="outline"
                              className="w-full rounded-lg border-green-500 text-green-500 hover:bg-green-600 hover:text-white sm:w-auto"
                              disabled={isSettlementDisabled || isSettling}
                            >
                              {isSettling 
                                ? "Settling..." 
                                : isNetSettlement 
                                  ? "Net Settle" 
                                  : "Settle Selected"
                              }
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {isNetSettlement
                                ? `Net settle: ₹${formatAmount(Math.abs(currentUserSummary?.summary.netBalance ?? 0))}`
                                : `Settle selected: ₹${formatAmount(totalAmount)}`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Confirm Settlement
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to settle {isNetSettlement ? "the net balance" : "the selected expenses"}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
              disabled={isSettling}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAndSettle}
              className="bg-green-500 text-white hover:bg-green-600"
              disabled={isSettling}
            >
              {isSettling ? "Settling..." : "Confirm Settlement"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UserSelectionModal
        isOpen={userSelectionOpen}
        onClose={() => setUserSelectionOpen(false)}
        onSelect={handleUserSelect}
        availableUsers={groupMemberName.filter((member) => member.userId !== user)}
      />
    </>
  )
}

export default SettleUp

