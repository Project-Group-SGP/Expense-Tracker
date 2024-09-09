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
  memberName: string
  memberId: string
  expenses: Expense[]
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
  const isChecked = selectedExpenses?.includes(expense.memberId)

  // Handle checkbox state changes
  const handleCheckboxChange = (checked) => {
    if (checked) {
      onExpenseChange("selectedExpenses", [
        ...selectedExpenses,
        expense.memberId,
      ])
    } else {
      onExpenseChange(
        "selectedExpenses",
        selectedExpenses.filter((id) => id !== expense.memberId)
      )
    }
  }

  return (
    <div className="flex cursor-pointer items-center justify-between rounded-md border p-4 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <p className="font-semibold">{expense.memberName}</p>
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

  const safeUsersYouNeedToPay = usersYouNeedToPay || []

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

  const handleSubmit = async (data: FormSchema) => {
    try {
      const { fromUser, toUser, selectedExpenses, transactionDate } = data

      const selectedUser = usersYouNeedToPay.find(
        (user) => user.memberId === toUser
      )
      if (!selectedUser) {
        throw new Error("Selected user not found.")
      }

      const totalAmount = selectedExpenses.reduce((sum, expenseId) => {
        const expense = selectedUser.expenses.find((e) => e.id === expenseId)
        return sum + (expense ? expense.amount : 0)
      }, 0)

      const loading = toast.loading("Settling up...")
      setOpen(false)

      try {
        await settleUp({
          payerId: fromUser,
          groupID: groupID,
          recipientId: toUser,
          amount: totalAmount,
          expenseIds: selectedExpenses,
          transactionDate: transactionDate,
        })

        toast.success("Successfully settled up!", {
          closeButton: true,
          icon: "🤝",
          duration: 4500,
        })

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
        toast.dismiss(loading)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const selectedUserExpenses = useMemo(() => {
    const selectedUser = safeUsersYouNeedToPay.filter(
      (user) => user.memberId === form.watch("toUser")
    )
    console.log(safeUsersYouNeedToPay, form.watch("toUser"), selectedUser)
    return selectedUser ? selectedUser : []
  }, [safeUsersYouNeedToPay, form.watch("toUser")])

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
      <DialogContent className="h-[90vh] overflow-y-auto sm:max-w-[425px]">
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

// export function SettleUp({
//   groupMemberName,
//   usersYouNeedToPay,
//   user,
//   params: { groupID },
// }: SettleUpProps) {
//   const [open, setOpen] = useState(false)
//   const [userSelectionOpen, setUserSelectionOpen] = useState(false)
//   const [selectingFor, setSelectingFor] = useState<
//     "fromUser" | "toUser" | null
//   >(null)

//   console.log(usersYouNeedToPay);

//   const availableRecipients = useMemo(
//     () =>
//       groupMemberName.filter((member) =>
//         usersYouNeedToPay.some((user) => user.memberId === member.userId)
//       ),
//     [groupMemberName, usersYouNeedToPay]
//   )

//   const defaultToUser = useMemo(() => {
//     return usersYouNeedToPay.length > 0 ? usersYouNeedToPay[0].memberId : ""
//   }, [usersYouNeedToPay])

//   const calculateDefaultAmount = (userId: string) => {
//     const userToPay = usersYouNeedToPay.find((user) => user.memberId === userId)
//     return userToPay ? userToPay.amountToPay.toFixed(2) : ""
//   }

//   const form = useForm<FormSchema>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       fromUser: user,
//       toUser: defaultToUser,
//       amount: calculateDefaultAmount(defaultToUser),
//       transactionDate: new Date(),
//     },
//   })

//   useEffect(() => {
//     if (defaultToUser) {
//       form.setValue("toUser", defaultToUser)
//       form.setValue("amount", calculateDefaultAmount(defaultToUser))
//     }
//   }, [defaultToUser, form])

//   const handleUserSelect = (selectedUser: GroupMember) => {
//     if (selectingFor) {
//       form.setValue(selectingFor, selectedUser.userId)
//       if (selectingFor === "toUser") {
//         const amount = calculateDefaultAmount(selectedUser.userId)
//         form.setValue("amount", amount)
//       }
//     }
//     setUserSelectionOpen(false)
//   }

//   // Handle form submission
//   const handleSubmit = async (data: FormSchema) => {
//     try {
//       const { fromUser, toUser, amount } = data

//       // Find the amount to be paid for the selected recipient
//       const recipient = usersYouNeedToPay.find(
//         (user) => user.memberId === toUser
//       )
//       if (!recipient) {
//         throw new Error(
//           "Recipient not found in the list of users you need to pay."
//         )
//       }

//       // Convert amount to a number for validation
//       const amountToPay = parseFloat(amount)
//       if (amountToPay > recipient.amountToPay) {
//         throw new Error(
//           "Amount to pay exceeds the pending amount for the recipient."
//         )
//       }

//       const loading = toast.loading("Adding Expense...")
//       setOpen(false)
//       try {
//         // Call settleUp API
//         await settleUp({
//           payerId: fromUser,
//           groupID: groupID,
//           recipientId: toUser,
//           amount: amountToPay,
//         })

//         console.log("Form submitted:", data)

//         // Show success message and reset form
//         toast.success("Settling up...", {
//           closeButton: true,
//           icon: "🤝",
//           duration: 4500,
//         })

//         form.reset() // Reset the form fields
//         setOpen(false) // Close the form/modal after submission
//       } catch (error) {
//         console.error(error)

//         // Display error message using toast
//         const errorMessage =
//           error instanceof Error ? error.message : "An unknown error occurred"
//         toast.error(errorMessage, {
//           closeButton: true,
//           icon: "❌",
//           duration: 4500,
//         })
//       }
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   if (usersYouNeedToPay.length === 0) {
//     return (
//       <Button
//         className="w-[150px] border-green-500 text-green-500 hover:bg-green-700 hover:text-white"
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
//           className="w-[150px] border-green-500 text-green-500 hover:bg-green-700 hover:text-white"
//           variant="outline"
//           onClick={() => setOpen(true)}
//         >
//           Settle up 🤝
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="text-center sm:text-left">
//             <span className="text-green-500">Settle up</span> 🤝
//           </DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(handleSubmit)}
//             className="space-y-4"
//           >
//             <div className="flex items-center justify-center space-x-4">
//               <UserAvatar
//                 user={
//                   groupMemberName.find((u) => u.userId === user) ||
//                   groupMemberName[0]
//                 }
//                 size={85}
//               />
//               <div className="text-2xl">→</div>

//               <FormField
//                 control={form.control}
//                 name="toUser"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormControl>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="h-24 w-24 rounded-full border-none p-0"
//                         onClick={() => {
//                           setSelectingFor("toUser")
//                           setUserSelectionOpen(true)
//                         }}
//                       >
//                         <UserAvatar
//                           user={
//                             groupMemberName.find(
//                               (u) => u.userId === field.value
//                             ) || { userId: "", name: "Select", avatar: "" }
//                           }
//                           size={85}
//                         />
//                       </Button>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div className="text-center">
//               <span className="text-green-500">
//                 {groupMemberName.find((u) => u.userId === user)?.name}
//               </span>{" "}
//               paid{" "}
//               <span className="text-blue-500">
//                 {groupMemberName.find((u) => u.userId === form.watch("toUser"))
//                   ?.name || "Select recipient"}
//               </span>
//             </div>
//             <FormField
//               control={form.control}
//               name="amount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       type="number"
//                       placeholder="₹ 0"
//                       className="text-center text-3xl font-bold"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="transactionDate"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Transaction Date</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal sm:w-[360px]",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value
//                             ? format(field.value, "PPP")
//                             : "Pick a date"}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={(date) => field.onChange(date)}
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

//             <div className="flex justify-end space-x-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 variant="outline"
//                 className="ml-2 border-green-500 text-green-500 hover:bg-green-600"
//               >
//                 Settle up
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//       <UserSelectionModal
//         isOpen={userSelectionOpen}
//         onClose={() => setUserSelectionOpen(false)}
//         onSelect={handleUserSelect}
//         availableUsers={availableRecipients}
//       />
//     </Dialog>
//   )
// }

// export default SettleUp
