// "use client"
// import React, { useState, useMemo } from "react"
// import { useForm, Controller } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
// import * as z from "zod"
// import { toast } from "sonner"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
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
// import { Checkbox } from "@/components/ui/checkbox"
// import { cn } from "@/lib/utils"
// import { UserAvatar } from "./UserAvatar"
// import { settleUp } from "../group"



// const formSchema = z.object({
//   fromUser: z.string().min(1, "Please select a valid payer."),
//   toUser: z.string().min(1, "Please select a valid recipient."),
//   selectedExpenses: z
//     .array(z.string())
//     .min(1, "Please select at least one expense to settle up."),
//   transactionDate: z.date().refine((date) => date <= new Date(), {
//     message: "Transaction date cannot be in the future",
//   }),
// })

// type FormSchema = z.infer<typeof formSchema>

// interface GroupMember {
//   userId: string
//   name: string
//   avatar: string
// }

// interface Expense {
//   id: string
//   description: string
//   amountToPay: number
// }

// interface EnhancedUserToPay {
//   id: string
//   memberName: string
//   memberId: string
//   // expenses: Expense[]
//   amountToPay:number
// }

// interface SettleUpProps {
//   groupMemberName: GroupMember[]
//   usersYouNeedToPay: EnhancedUserToPay[]
//   user: string
//   params: { groupID: string }
// }

// const ExpenseCard: React.FC<{
//   expense: EnhancedUserToPay
//   isChecked: boolean
//   onToggle: (id: string) => void
// }> = ({ expense, isChecked, onToggle }) => (
//   <div
//     className={cn(
//       "flex cursor-pointer items-center justify-between rounded-md border p-4 transition-all",
//       isChecked ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
//     )}
//     onClick={() => onToggle(expense.id)}
//   >
//     <div>
//       {/* <p className="font-semibold">{expense.description}</p> */}
//       <p className="text-sm text-gray-600">
//         Amount to Pay: ₹{expense.amountToPay.toFixed(2)}
//       </p>
//     </div>
//     <Checkbox checked={isChecked} className="text-green-500" />
//   </div>
// )

// export function SettleUp({
//   groupMemberName,
//   usersYouNeedToPay,
//   user,
//   params: { groupID },
// }: SettleUpProps) {
//   const [open, setOpen] = useState(false)
//   const router = useRouter()

//   const form = useForm<FormSchema>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       fromUser: user,
//       toUser: usersYouNeedToPay[0]?.id || "",
//       selectedExpenses: [],
//       transactionDate: new Date(),
//     },
//   })

//   const selectedToUser = form.watch("toUser")
//   const selectedExpenses = form.watch("selectedExpenses")

//   const filteredExpenses = useMemo(
//     () => usersYouNeedToPay.filter((expense) => expense.id === selectedToUser),
//     [usersYouNeedToPay, selectedToUser]
//   )

//   const totalAmount = useMemo(
//     () =>
//       filteredExpenses
//         .filter((expense) => selectedExpenses.includes(expense.id))
//         .reduce((sum, expense) => sum + expense.amountToPay, 0),
//     [filteredExpenses, selectedExpenses]
//   )

//   const handleSubmit = async (data: FormSchema) => {
//     const loadingToast = toast.loading("Settling up...")
//     setOpen(false)

//     try {
//       const expenseDetails = filteredExpenses
//         .filter((expense) => data.selectedExpenses.includes(expense.id))
//         .map((expense) => ({
//           expenseid: expense.id,
//           amount: expense.amountToPay,
//         }))

//       await settleUp({
//         payerId: data.fromUser,
//         groupID: groupID,
//         recipientId: data.toUser,
//         expenseIds: expenseDetails,
//         transactionDate: data.transactionDate,
//       })

//       toast.success("Successfully settled up!", {
//         id: loadingToast,
//         duration: 3000,
//       })
//       router.refresh()
//       form.reset()
//     } catch (error) {
//       console.error(error)
//       toast.error(
//         error instanceof Error ? error.message : "An unknown error occurred",
//         { id: loadingToast, duration: 3000 }
//       )
//     }
//   }

//   if (usersYouNeedToPay.length === 0) {
//     return (
//       <Button
//         className="w-[150px] border-green-500 text-green-500"
//         variant="outline"
//         disabled
//       >
//         No users to pay
//       </Button>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           className="w-[150px] border-green-500 text-green-500 hover:bg-green-50"
//           variant="outline"
//         >
//           Settle up 🤝
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="text-center text-green-500 sm:text-left">
//             Settle up 🤝
//           </DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <div className="flex items-center justify-center space-x-4">
//               <UserAvatar
//                 user={groupMemberName.find((u) => u.userId === user) || groupMemberName[0]}
//                 size={85}
//               />
//               <div className="text-2xl">→</div>
//               <Controller
//                 name="toUser"
//                 control={form.control}
//                 render={({ field }) => (
//                   <select
//                     {...field}
//                     className="rounded-full border-2 border-gray-300 p-2"
//                   >
//                     {usersYouNeedToPay.map((user) => (
//                       <option key={user.id} value={user.id}>
//                         {groupMemberName.find((m) => m.userId === user.id)?.name}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               />
//             </div>
//             <div className="text-center text-lg">
//               <span className="font-semibold text-green-500">
//                 {groupMemberName.find((u) => u.userId === user)?.name}
//               </span>{" "}
//               paid{" "}
//               <span className="font-semibold text-blue-500">
//                 {groupMemberName.find((u) => u.userId === selectedToUser)?.name}
//               </span>
//             </div>
//             <FormField
//               control={form.control}
//               name="selectedExpenses"
//               render={() => (
//                 <FormItem>
//                   <FormLabel className="text-base font-semibold">Select expenses to settle:</FormLabel>
//                   <div className="mt-2 space-y-2">
//                     {filteredExpenses.map((expense) => (
//                       <ExpenseCard
//                         key={expense.id}
//                         expense={expense}
//                         isChecked={selectedExpenses.includes(expense.id)}
//                         onToggle={(id) => {
//                           const updatedExpenses = selectedExpenses.includes(id)
//                             ? selectedExpenses.filter((expId) => expId !== id)
//                             : [...selectedExpenses, id]
//                           form.setValue("selectedExpenses", updatedExpenses)
//                         }}
//                       />
//                     ))}
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="transactionDate"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Transaction Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant="outline"
//                           className={cn(
//                             "w-full justify-start text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         disabled={(date) =>
//                           date > new Date() || date < new Date("1900-01-01")
//                         }
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <div className="flex items-center justify-between">
//               <div className="text-lg font-semibold">
//                 Total: ₹{totalAmount.toFixed(2)}
//               </div>
//               <div className="space-x-2">
//                 <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="bg-green-500 text-white hover:bg-green-600"
//                 >
//                   Settle up
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default SettleUp

"use client"
import React, { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import * as z from "zod"
import { toast } from "sonner"
import { UserAvatar } from "./UserAvatar"
import { settleUp } from "../group"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

interface GroupMember {
  userId: string
  name: string
  avatar: string
}

const formSchema = z.object({
  fromUser: z.string().min(1, "Please select a valid payer."),
  toUser: z.string().min(1, "Please select a valid recipient."),
  selectedExpenses: z
    .array(z.string())
    .min(1, "Please select at least one expense to settle up."),
  transactionDate: z.date().refine((date) => date <= new Date(), {
    message: "Transaction date cannot be in the future",
  }),
})

type FormSchema = z.infer<typeof formSchema>

interface Expense {
  id: string
  description: string
  amount: number
}

interface EnhancedUserToPay {
  id: string
  memberName: string
  memberId: string
  // expenses: Expense[]
  amountToPay:number
}

interface SettleUpProps {
  groupMemberName: GroupMember[]
  usersYouNeedToPay: EnhancedUserToPay[]
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
      <DialogContent className="max-w-[425px]">
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
                  onClick={() => {
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

const ExpenseCard = ({ expense, selectedExpenses, onExpenseChange }) => {
  // Check if the current expense is selected
  const isChecked = selectedExpenses?.includes(expense.id)

  // Handle checkbox state changes
  const handleCheckboxChange = (checked) => {
    const updatedExpenses = checked
      ? [...selectedExpenses, expense.id]
      : selectedExpenses.filter((id) => id !== expense.id)
    onExpenseChange("selectedExpenses", updatedExpenses)
  }

  return (
    <div className="flex cursor-pointer items-center justify-between rounded-md border p-4 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <p className="font-semibold">{expense.description}</p>
        <p className="text-sm text-gray-600">
          Amount to Pay: ₹{expense.amountToPay.toFixed(2)}
        </p>
      </div>
      <div>
        <Checkbox
          checked={isChecked}
          onCheckedChange={handleCheckboxChange}
          className="text-blue-500"
        />
      </div>
    </div>
  )
}

// Function to open the dialog
const openSettleDialog = (expense) => {
  // Implement the logic to open the dialog with expense details
  console.log("Open settle dialog for:", expense)
}

export function SettleUp({
  groupMemberName,
  usersYouNeedToPay,
  user,
  params: { groupID },
}: SettleUpProps) {
  const [open, setOpen] = useState(false)
  const [userSelectionOpen, setUserSelectionOpen] = useState(false)
  const [selectingFor, setSelectingFor] = useState<
    "fromUser" | "toUser" | null
  >(null)

  const route = useRouter()
  const safeUsersYouNeedToPay = useMemo(() => usersYouNeedToPay || [], [usersYouNeedToPay]);

  const availableRecipients = useMemo(
    () =>
      groupMemberName.filter((member) =>
        safeUsersYouNeedToPay.some((user) => user.memberId === member.userId)
      ),
    [groupMemberName, safeUsersYouNeedToPay]
  )

  const defaultToUser = useMemo(() => {
    return safeUsersYouNeedToPay.length > 0
      ? safeUsersYouNeedToPay[0].memberId
      : ""
  }, [safeUsersYouNeedToPay])

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromUser: user,
      toUser: defaultToUser,
      selectedExpenses: [],
      transactionDate: new Date(),
    },
  })

  useEffect(() => {
    if (defaultToUser) {
      form.setValue("toUser", defaultToUser)
    }
  }, [defaultToUser, form])

  const handleUserSelect = (selectedUser: GroupMember) => {
    if (selectingFor === "toUser") {
      form.setValue("toUser", selectedUser.userId)
      form.setValue("selectedExpenses", [])
    }
    setUserSelectionOpen(false)
  }

  // handle form submission
  const handleSubmit = async (data: FormSchema) => {
    const { fromUser, toUser, selectedExpenses, transactionDate } = data

    const selectedUser = usersYouNeedToPay.find(
      (user) => user.memberId === toUser
    )
    if (!selectedUser) {
      toast.error("Selected user not found.", {
        closeButton: true,
        icon: "❌",
        duration: 4500,
      })
      return
    }

    console.log("Selected User: ", selectedUser)

    console.log("reciptientId: ", selectedExpenses)

    console.log("usersYouNeedToPay: ", usersYouNeedToPay)

    //selectedExpenses has all expense Id which is selected by user
    //usersYouNeedToPay has all user data which is available in group

    const expenseDetails = usersYouNeedToPay
      .filter((user) => selectedExpenses.includes(user.id))
      .map((user) => ({
        expenseid: user.id,
        amount: user.amountToPay,
      }))

    console.log(expenseDetails)

    const loadingToast = toast.loading("Settling up...")
    setOpen(false)

    try {
      await settleUp({
        payerId: fromUser,
        groupID: groupID,
        recipientId: selectedUser.memberId,
        // amount: totalAmount,
        expenseIds: expenseDetails,
        transactionDate: transactionDate,
      })

      toast.dismiss(loadingToast);

      toast.success("Successfully settled up!", {
        closeButton: true,
        icon: "🤝",
        duration: 4500,
      })

      // Reset the form
      route.refresh()

      form.reset()
    } catch (error) {
      console.error(error)
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred"
      toast.error(errorMessage, {
        closeButton: true,
        icon: "❌",
        duration: 4500,
      })
    } finally {
      toast.dismiss(loadingToast)
    }
  }

  const toUser = form.watch("toUser");

  const selectedUserExpenses = useMemo(() => {
    const selectedUser = safeUsersYouNeedToPay.filter(
      (user) => user.memberId === toUser
    )
    console.log(safeUsersYouNeedToPay, toUser, selectedUser)
    return selectedUser ? selectedUser : []
  }, [safeUsersYouNeedToPay, toUser])

  if (safeUsersYouNeedToPay.length === 0) {
    return (
      <Button
        className="w-[150px] border-green-500 text-green-500 hover:bg-green-700 hover:text-white"
        variant="outline"
        disabled
      >
        No users to pay
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-[150px] border-green-500 text-green-500 hover:bg-green-700 hover:text-white"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          Settle up 🤝
        </Button>
      </DialogTrigger>
      <DialogContent className="h-max-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            <span className="text-green-500">Settle up</span> 🤝
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="flex items-center justify-center space-x-4">
              <UserAvatar
                user={
                  groupMemberName.find((u) => u.userId === user) ||
                  groupMemberName[0]
                }
                size={85}
              />
              <div className="text-2xl">→</div>
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
            <div className="text-center">
              <span className="text-green-500">
                {groupMemberName.find((u) => u.userId === user)?.name}
              </span>{" "}
              paid{" "}
              <span className="text-blue-500">
                {groupMemberName.find((u) => u.userId === form.watch("toUser"))
                  ?.name || "Select recipient"}
              </span>
            </div>
            <FormField
              control={form.control}
              name="selectedExpenses"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Select expenses to settle:
                    </FormLabel>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedUserExpenses.map((expense) => (
                      <ExpenseCard
                        //@ts-ignore
                        key={expense.memberId + expense.amountToPay} // Assuming memberId and amountToPay combination is unique
                        expense={expense}
                        selectedExpenses={form.watch("selectedExpenses")}
                        onExpenseChange={form.setValue}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
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
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
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
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="ml-2 border-green-500 text-green-500 hover:bg-green-600"
              >
                Settle up
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      <UserSelectionModal
        isOpen={userSelectionOpen}
        onClose={() => setUserSelectionOpen(false)}
        onSelect={handleUserSelect}
        availableUsers={availableRecipients}
      />
    </Dialog>
  )
}
export default SettleUp
