// "use client"

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
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
// import { cn } from "@/lib/utils"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { format } from "date-fns"
// import { CalendarIcon, Check, ChevronDown } from "lucide-react"
// import { useEffect, useState } from "react"
// import { Controller, useForm } from "react-hook-form"
// import { toast } from "sonner"
// import * as z from "zod"
// import { AddGroupExpense } from "../group"
// import { useRouter } from "next/navigation"
// import { categories, suggestCategory } from "@/lib/categoryKeywords"
// import { CategoryTypes } from "@prisma/client"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { ScrollArea } from "@/components/ui/scroll-area"

// // Mapping categories to emojis
// const categoryEmojis = {
//   [CategoryTypes.Other]: "🔖",
//   [CategoryTypes.Bills]: "🧾",
//   [CategoryTypes.Food]: "🍽️",
//   [CategoryTypes.Entertainment]: "🎮",
//   [CategoryTypes.Transportation]: "🚗",
//   [CategoryTypes.EMI]: "💳",
//   [CategoryTypes.Healthcare]: "🏥",
//   [CategoryTypes.Education]: "🎓",
//   [CategoryTypes.Investment]: "💼",
//   [CategoryTypes.Shopping]: "🛒",
//   [CategoryTypes.Fuel]: "⛽",
//   [CategoryTypes.Groceries]: "🛍️",
// }

// // Form schema
// const formSchema = z.object({
//   title: z.string().min(1, "Title is required"),
//   amount: z
//     .string()
//     .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
//       message: "Amount must be a valid number greater than 0",
//     }),
//   paidBy: z.string(),
//   date: z.date(),
//   splitType: z.enum(["Equally", "As Amounts"]),
//   splitWith: z
//     .array(
//       z.object({
//         id: z.string(),
//         name: z.string(),
//         included: z.boolean(),
//         amount: z.number().optional(),
//       })
//     )
//     .min(1, "At least one person must be selected to split with"),
//   category: z.nativeEnum(CategoryTypes),
// })

// export function AddExpense({
//   params,
//   groupMemberName,
//   user,
// }: {
//   params: { groupID: string }
//   groupMemberName: { userId: string; name: string; avatar: string }[]
//   user: string
// }) {
//   const [open, setOpen] = useState(false)
//   const router = useRouter()
//   const [suggestedCategory, setSuggestedCategory] = useState<CategoryTypes>(
//     CategoryTypes.Other
//   )

//   // State for members
//   const [members, setMembers] = useState<
//     {
//       id: string
//       name: string
//       avatar: string
//       included: boolean
//       isMe: boolean
//       amount: number
//     }[]
//   >([])

//   useEffect(() => {
//     setMembers(
//       groupMemberName.map((member) => ({
//         id: member.userId,
//         name: member.name,
//         avatar: member.avatar,
//         included: true,
//         isMe: member.userId === user,
//         amount: 0,
//       }))
//     )
//   }, [groupMemberName, user])

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       amount: "",
//       paidBy: user,
//       date: new Date(),
//       splitType: "Equally",
//       splitWith: members,
//       category: CategoryTypes.Food,
//     },
//   })

//   const watchAmount = form.watch("amount")
//   const watchSplitType = form.watch("splitType")
//   const watchTitle = form.watch("title")

//   useEffect(() => {
//     if (watchTitle) {
//       const suggested = suggestCategory(watchTitle)
//       setSuggestedCategory(suggested)

//       // Always update the form value with the new suggestion
//       //@ts-ignore
//       form.setValue("category", suggested, { shouldValidate: true })
//     } else {
//       setSuggestedCategory(CategoryTypes.Other)
//       //@ts-ignore
//       form.setValue("category", CategoryTypes.Other, { shouldValidate: true })
//     }
//   }, [watchTitle, form])

//   // useEffect(() => {
//   //   const totalAmount = parseFloat(watchAmount) || 0
//   //   const splitType = watchSplitType

//   //   const includedMembers = members.filter((m) => m.included)
//   //   let updatedMembers = [...members]

//   //   if (splitType === "Equally") {
//   //     const splitAmount = totalAmount / includedMembers.length || 0
//   //     updatedMembers = updatedMembers.map((member) => ({
//   //       ...member,
//   //       amount: member.included ? splitAmount : 0,
//   //     }))
//   //   } else if (splitType === "As Amounts") {
//   //     const totalAssigned = updatedMembers.reduce(
//   //       (sum, member) => sum + (member.included ? member.amount : 0),
//   //       0
//   //     )
//   //     const remaining = totalAmount - totalAssigned
//   //     if (remaining > 0) {
//   //       const splitRemaining = remaining / includedMembers.length
//   //       updatedMembers = updatedMembers.map((member) => ({
//   //         ...member,
//   //         amount: member.included ? member.amount + splitRemaining : 0,
//   //       }))
//   //     }
//   //   }

//   //   const hasChanged =
//   //     JSON.stringify(members) !== JSON.stringify(updatedMembers)
//   //   if (hasChanged) {
//   //     setMembers(updatedMembers)
//   //     form.setValue("splitWith", updatedMembers)
//   //   }
//   // }, [watchAmount, watchSplitType, members, form])

//   useEffect(() => {
//     const totalAmount = parseFloat(watchAmount) || 0;
//     const splitType = watchSplitType;
  
//     const includedMembers = members.filter((m) => m.included);
//     let updatedMembers = [...members];
  
//     if (splitType === "Equally") {
//       const splitAmount = totalAmount / includedMembers.length || 0;
//       updatedMembers = updatedMembers.map((member) => ({
//         ...member,
//         amount: member.included ? splitAmount : 0,
//       }));
//     } else if (splitType === "As Amounts") {
//       const totalAssigned = updatedMembers.reduce(
//         (sum, member) => sum + (member.included ? member.amount : 0),
//         0
//       );
  
//       if (totalAssigned > totalAmount) {
//         // Handle case where assigned amounts exceed total
//         toast.error("Assigned amounts exceed the total expense.");
//       } else if (totalAssigned < totalAmount) {
//         // Handle remaining amount by distributing equally among included members
//         const remaining = totalAmount - totalAssigned;
//         const splitRemaining = remaining / includedMembers.length;
  
//         updatedMembers = updatedMembers.map((member) => ({
//           ...member,
//           amount: member.included ? member.amount + splitRemaining : 0,
//         }));
//       }
//     }
  
//     const hasChanged =
//       JSON.stringify(members) !== JSON.stringify(updatedMembers);
  
//     if (hasChanged) {
//       setMembers(updatedMembers);
//       form.setValue("splitWith", updatedMembers);
//     }
//   }, [watchAmount, watchSplitType, members, form]);
  
//   const handleMemberToggle = (id: string, included: boolean) => {
//     const updatedMembers = members.map((m) =>
//       m.id === id ? { ...m, included, amount: included ? m.amount : 0 } : m
//     )
//     setMembers(updatedMembers)
//     form.setValue("splitWith", updatedMembers)
//   }

//   // const handleAmountChange = (id: string, amount: number) => {
//   //   const updatedMembers = members.map((m) =>
//   //     m.id === id ? { ...m, amount } : m
//   //   )
//   //   setMembers(updatedMembers)
//   //   form.setValue("splitWith", updatedMembers)
//   // }
//   const handleAmountChange = (id: string, amount: number) => {
//     const updatedMembers = members.map((m) =>
//       m.id === id ? { ...m, amount } : m
//     );
//     setMembers(updatedMembers);
    
//     // Update form value immediately to ensure synchronization
//     form.setValue("splitWith", updatedMembers, { shouldValidate: true });
//   };
  

//   // Form submission
//   const onSubmit = async (data) => {
//     const totalAmount = parseFloat(data.amount);
//     const totalSplitAmount = data.splitWith.reduce(
//       (sum, member) => sum + (member.included ? member.amount : 0),
//       0
//     );
  
//     // Validate the total split amounts against the total expense amount
//     if (Math.abs(totalSplitAmount - totalAmount) > 0.01) {
//       toast.error(
//         "The split amounts do not add up to the total expense amount."
//       );
//       return;
//     }
//     const groupId = params.groupID
//     const paidById = members.find((member) => member.name === data.paidBy)?.id

//     if (!paidById) {
//       console.error("PaidBy user ID not found")
//       return
//     }

//     const splitsall = data.splitWith.map((member) => ({
//       userId: member.id,
//       amount: member.amount || 0,
//     }))

//     const splits = splitsall.filter((split) => split.amount !== 0)

//     if (splits.length < 2) {
//       toast.error("Please select at least two members")
//       return
//     }

//     const loading = toast.loading("Adding Expense...")
//     setOpen(false)
//     try {
//       const response = await AddGroupExpense({
//         groupID: groupId,
//         paidById: String(paidById),
//         title: data.title,
//         amount: totalAmount,
//         date: data.date,
//         category: data.category,
//         splits: splits,
//       })

//       if (response.success) {
//         toast.success("Expense added successfully", {
//           closeButton: true,
//           icon: "😤",
//           duration: 4500,
//           id: loading,
//         })

//         form.reset()
//       } else {
//         console.error("Failed to Add Expense")

//         toast.error("Error Adding Expense", {
//           closeButton: true,
//           icon: "❌",
//           duration: 4500,
//         })
//       }
//     } catch (error) {
//       console.error("Error adding expense:", error)
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           className="w-full border-red-500 text-red-500 hover:bg-red-700 hover:text-white sm:w-[150px]"
//           variant="outline"
//           onClick={() => setOpen(true)}
//         >
//           Add an Expense 😤
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-h-[95vh] w-[95vw] overflow-y-auto rounded-lg sm:max-w-[450px]">
//         <DialogHeader>
//           <DialogTitle className="mb-2 text-center sm:text-left">
//             <span className="text-red-500">Add an Expense</span> 😤
//           </DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-4 rounded-md"
//           >    {/* Amount */}
//           <FormField
//             control={form.control}
//             name="amount"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Amount</FormLabel>
//                 <div className="flex">
//                   <div className="rounded border pl-[10px] pr-[10px] pt-[5px]">
//                     ₹
//                   </div>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="0.00"
//                       {...field}
//                       className="ml-2 flex-grow"
//                       onChange={(e) => {
//                         field.onChange(e)
//                       }}
//                     />
//                   </FormControl>
//                 </div>
//               </FormItem>
//             )}
//           />
//       {/* Description and Category */}
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <div className="flex flex-col gap-2 sm:flex-row">
//                     <FormControl>
//                       <Input
//                         placeholder="E.g. Drinks"
//                         {...field}
//                         className="flex-grow"
//                       />
//                     </FormControl>
//                     <Controller
//                       name="category"
//                       control={form.control}
//                       render={({ field }) => (
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button
//                               variant="outline"
//                               className="w-full justify-between sm:w-[80px]"
//                             >
//                               {categoryEmojis[field.value]}
//                               <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent className="w-[200px]">
//                             <ScrollArea className="h-[300px]">
//                               {categories.map((category) => (
//                                 <DropdownMenuItem
//                                   key={category.name}
//                                   onSelect={() => field.onChange(category.name)}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       "mr-2 h-4 w-4",
//                                       category.name === field.value
//                                         ? "opacity-100"
//                                         : "opacity-0"
//                                     )}
//                                   />
//                                   {categoryEmojis[category.name]}{" "}
//                                   {category.name}
//                                   {category.name === suggestedCategory &&
//                                     " (Suggested)"}
//                                 </DropdownMenuItem>
//                               ))}
//                             </ScrollArea>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       )}
//                     />
//                   </div>
//                 </FormItem>
//               )}
//             />

//             {/* Paid By and Date */}
//             <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0">
//               <FormField
//                 control={form.control}
//                 name="paidBy"
//                 render={({ field }) => (
//                   <FormItem className="flex-grow">
//                     <FormLabel>Paid By</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <SelectTrigger className="w-full sm:w-[180px]">
//                         <SelectValue placeholder="Select user" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {members.map((member) => (
//                           <SelectItem key={member.id} value={member.name}>
//                             {member.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="date"
//                 render={({ field }) => (
//                   <FormItem className="flex-grow">
//                     <FormLabel>When</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant="outline"
//                             className={cn(
//                               "w-full pl-3 text-left font-normal sm:w-[200px]",
//                               !field.value && "text-muted-foreground"
//                             )}
//                           >
//                             {field.value
//                               ? format(field.value, "MMMM d, yyyy")
//                               : "Pick a date"}
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
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Split Type */}
//             <FormField
//               control={form.control}
//               name="splitType"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Split</FormLabel>
//                   <div className="mb-4">
//                     <Select
//                       onValueChange={(value) => {
//                         field.onChange(value)
//                       }}
//                       defaultValue={field.value}
//                     >
//                       <SelectTrigger className="w-full sm:w-[120px]">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="Equally">Equally</SelectItem>
//                         <SelectItem value="As Amounts">As Amounts</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div
//                     className={`grid grid-cols-1 content-start gap-2 ${members.length < 3 ? "" : "max-h-[40vh] sm:max-h-[30vh]"} overflow-y-auto`}
//                   >
//                     {members.map((member) => (
//                       <div
//                         key={member.id}
//                         className="flex items-center justify-between"
//                       >
//                         <div className="flex items-center">
//                           <Switch
//                             id={`member-${member.id}`}
//                             className="mr-2"
//                             checked={member.included}
//                             onCheckedChange={(checked) =>
//                               handleMemberToggle(member.id, checked)
//                             }
//                           />
//                           <label htmlFor={`member-${member.id}`}>
//                             {member.name} {member.isMe && "(me)"}
//                           </label>
//                         </div>
//                         <div>
//                           {watchSplitType === "As Amounts" ? (
//                             <Input
//                               type="number"
//                               value={Math.round(member.amount * 100) / 100}
//                               onChange={(e) =>
//                                 handleAmountChange(
//                                   member.id,
//                                   parseFloat(e.target.value) || 0
//                                 )
//                               }
//                               className="w-20"
//                               disabled={!member.included}
//                             />
//                           ) : (
//                             `₹${member.amount.toFixed(2)}`
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </FormItem>
//               )}
//             />

//             {/* Buttons */}
//             <div className="flex flex-col justify-end space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
//               <Button
//                 type="submit"
//                 variant="outline"
//                 className="w-full rounded-md border-red-500 text-red-500 hover:bg-red-600 sm:w-auto"
//               >
//                 Add Expense
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setOpen(false)}
//                 className="w-full rounded-md sm:w-auto"
//               >
//                 Cancel
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default AddExpense
"use client"
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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronDown } from 'lucide-react'
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { AddGroupExpense } from "../group"
import { useRouter } from "next/navigation"
import { categories, suggestCategory } from "@/lib/categoryKeywords"
import { CategoryTypes } from "@prisma/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mapping categories to emojis
const categoryEmojis = {
  [CategoryTypes.Other]: "🔖",
  [CategoryTypes.Bills]: "🧾",
  [CategoryTypes.Food]: "🍽️",
  [CategoryTypes.Entertainment]: "🎮",
  [CategoryTypes.Transportation]: "🚗",
  [CategoryTypes.EMI]: "💳",
  [CategoryTypes.Healthcare]: "🏥",
  [CategoryTypes.Education]: "🎓",
  [CategoryTypes.Investment]: "💼",
  [CategoryTypes.Shopping]: "🛒",
  [CategoryTypes.Fuel]: "⛽",
  [CategoryTypes.Groceries]: "🛍️",
}

// Form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
  paidBy: z.string(),
  date: z.date(),
  splitType: z.enum(["Equally", "As Amounts"]),
  splitWith: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        included: z.boolean(),
        amount: z.number().optional(),
      })
    )
    .min(1, "At least one person must be selected to split with"),
  category: z.enum(Object.values(CategoryTypes) as [string, ...string[]]),
})

export function AddExpense({
  params,
  groupMemberName,
  user,
}: {
  params: { groupID: string }
  groupMemberName: { userId: string; name: string; avatar: string }[]
  user: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [suggestedCategory, setSuggestedCategory] = useState<CategoryTypes>(
    CategoryTypes.Other
  )

  // State for members
  const [members, setMembers] = useState<
    {
      id: string
      name: string
      avatar: string
      included: boolean
      isMe: boolean
      amount: number
      userSet: boolean
    }[]
  >([])

  useEffect(() => {
    setMembers(
      groupMemberName.map((member) => ({
        id: member.userId,
        name: member.name,
        avatar: member.avatar,
        included: true,
        isMe: member.userId === user,
        amount: 0,
        userSet: false,
      }))
    )
  }, [groupMemberName, user])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      paidBy: user,
      date: new Date(),
      splitType: "Equally",
      splitWith: members,
      category: "Food" as keyof typeof CategoryTypes,
    },
  })

  const watchAmount = form.watch("amount")
  const watchSplitType = form.watch("splitType")
  const watchTitle = form.watch("title")

  useEffect(() => {
    if (watchTitle) {
      const suggested = suggestCategory(watchTitle)
      setSuggestedCategory(suggested)
      form.setValue("category", suggested as keyof typeof CategoryTypes, { shouldValidate: true })
    } else {
      setSuggestedCategory(CategoryTypes.Other)
      form.setValue("category", "Other", { shouldValidate: true })
    }
  }, [watchTitle, form])

  useEffect(() => {
    const totalAmount = parseFloat(watchAmount) || 0;
    const splitType = watchSplitType;

    setMembers(prevMembers => {
      if (totalAmount === 0) {
        return prevMembers.map(m => ({ ...m, amount: 0, userSet: false }));
      }

      const includedMembers = prevMembers.filter((m) => m.included);
      
      if (splitType === "Equally") {
        const splitAmount = totalAmount / includedMembers.length;
        return prevMembers.map((member) => ({
          ...member,
          amount: member.included ? Number(splitAmount.toFixed(2)) : 0,
          userSet: false,
        }));
      } else {
        // For "As Amounts", preserve user-set amounts and distribute remaining
        let remainingAmount = totalAmount;
        const userSetMembers = prevMembers.filter(m => m.userSet && m.included);
        const nonUserSetMembers = prevMembers.filter(m => !m.userSet && m.included);

        // First, allocate amounts to user-set members
        userSetMembers.forEach(member => {
          remainingAmount -= member.amount;
        });

        // Distribute remaining amount among non-user-set members
        if (nonUserSetMembers.length > 0) {
          const amountPerMember = Math.max(0, remainingAmount / nonUserSetMembers.length);
          nonUserSetMembers.forEach(member => {
            member.amount = Number(amountPerMember.toFixed(2));
            remainingAmount -= member.amount;
          });
        }

        // Adjust the last non-user-set member to account for any rounding errors
        const lastNonUserSetMember = nonUserSetMembers[nonUserSetMembers.length - 1];
        if (lastNonUserSetMember) {
          lastNonUserSetMember.amount += remainingAmount;
          lastNonUserSetMember.amount = Number(lastNonUserSetMember.amount.toFixed(2));
        }

        return prevMembers;
      }
    });
  }, [watchAmount, watchSplitType]);

  const handleMemberToggle = (id: string, included: boolean) => {
    setMembers(prevMembers => {
      const updatedMembers = prevMembers.map((m) =>
        m.id === id ? { ...m, included, amount: included ? m.amount : 0, userSet: included ? m.userSet : false } : m
      );
      redistributeAmounts(updatedMembers);
      return updatedMembers;
    });
  }

  const handleAmountChange = (id: string, newAmount: number) => {
    const totalAmount = parseFloat(form.getValues("amount")) || 0;
    
    setMembers(prevMembers => {
      let updatedMembers = prevMembers.map(member =>
        member.id === id ? { ...member, amount: Math.max(0, newAmount), userSet: true } : member
      );

      redistributeAmounts(updatedMembers);
      return updatedMembers;
    });
  };

  const redistributeAmounts = (members) => {
    const totalAmount = parseFloat(form.getValues("amount")) || 0;
    let remainingAmount = totalAmount;

    // First, subtract amounts for user-set and included members
    members.forEach(member => {
      if (member.userSet && member.included) {
        remainingAmount -= member.amount;
      }
    });

    // Distribute remaining amount among non-user-set, included members
    const nonUserSetMembers = members.filter(m => !m.userSet && m.included);
    if (nonUserSetMembers.length > 0) {
      const amountPerMember = Math.max(0, remainingAmount / nonUserSetMembers.length);
      nonUserSetMembers.forEach((member, index) => {
        if (index === nonUserSetMembers.length - 1) {
          // Last member gets any remaining amount to account for rounding
          member.amount = Number(remainingAmount.toFixed(2));
        } else {
          member.amount = Number(amountPerMember.toFixed(2));
          remainingAmount -= member.amount;
        }
        member.amount < 0? member.amount = 0 : member.amount;
      });
    }

    form.setValue("splitWith", members, { shouldValidate: true });
  };

  // Form submission
  const onSubmit = async (data) => {
    const totalAmount = parseFloat(data.amount);
    const totalSplitAmount = data.splitWith.reduce(
      (sum, member) => sum + (member.included ? member.amount : 0),
      0
    );

    data.splitWith.forEach(element => {
      if(element.amount < 0){
        toast.error(
          "The split amounts cannot be negative."
        );
        return;
      }
    });
  
    if (Math.abs(totalSplitAmount - totalAmount) > 0.01) {
      toast.error(
        "The split amounts do not add up to the total expense amount."
      );
      return;
    }

    const groupId = params.groupID
    const paidById = members.find((member) => member.name === data.paidBy)?.id

    if (!paidById) {
      console.error("PaidBy user ID not found")
      return
    }

    const splitsall = data.splitWith.map((member) => ({
      userId: member.id,
      amount: member.amount || 0,
    }))

    const splits = splitsall.filter((split) => split.amount !== 0)

    if (splits.length < 2) {
      toast.error("Please select at least two members")
      return;
    }

    const loading = toast.loading("Adding Expense...")
    setOpen(false)
    try {
      const response = await AddGroupExpense({
        groupID: groupId,
        paidById: String(paidById),
        title: data.title,
        amount: totalAmount,
        date: data.date,
        category: data.category,
        splits: splits,
      })

      if (response.success) {
        toast.success("Expense added successfully", {
          closeButton: true,
          icon: "😤",
          duration: 4500,
          id: loading,
        })

        form.reset()
      } else {
        console.error("Failed to Add Expense")

        toast.error("Error Adding Expense", {
          closeButton: true,
          icon: "❌",
          duration: 4500,
        })
      }
    } catch (error) {
      console.error("Error adding expense:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full border-red-500 text-red-500 hover:bg-red-700 hover:text-white sm:w-[150px]"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          Add an Expense 😤
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[95vh] w-[95vw] overflow-y-auto rounded-lg sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="mb-2 text-center sm:text-left">
            <span className="text-red-500">Add an Expense</span> 😤
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 rounded-md"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <div className="flex">
                    <div className="rounded border pl-[10px] pr-[10px] pt-[5px]">
                      ₹
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        className="ml-2 flex-grow"
                        onChange={(e) => {
                          field.onChange(e);
                          const newAmount = parseFloat(e.target.value) || 0;
                          if (watchSplitType === "Equally") {
                            setMembers(prevMembers => {
                              const includedMembers = prevMembers.filter((m) => m.included);
                              const splitAmount = newAmount / includedMembers.length || 0;
                              const updatedMembers = prevMembers.map((member) => ({
                                ...member,
                                amount: member.included ? Number(splitAmount.toFixed(2)) : 0,
                                userSet: false,
                              }));
                              form.setValue("splitWith", updatedMembers, { shouldValidate: false });
                              return updatedMembers;
                            });
                          } else {
                            setMembers(prevMembers => {
                              const updatedMembers = [...prevMembers];
                              redistributeAmounts(updatedMembers);
                              return updatedMembers;
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <FormControl>
                      <Input
                        placeholder="E.g. Drinks"
                        {...field}
                        className="flex-grow"
                      />
                    </FormControl>
                    <Controller
                      name="category"
                      control={form.control}
                      render={({ field }) => (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between sm:w-[80px]"
                            >
                              {categoryEmojis[field.value]}
                              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[200px]">
                            <ScrollArea className="h-[300px]">
                              {categories.map((category) => (
                                <DropdownMenuItem
                                  key={category.name}
                                  onSelect={() => field.onChange(category.name)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      category.name === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {categoryEmojis[category.name]}{" "}
                                  {category.name}
                                  {category.name === suggestedCategory &&
                                    " (Suggested)"}
                                </DropdownMenuItem>
                              ))}
                            </ScrollArea>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    />
                  </div>
                </FormItem>
              )}
            />

            <div className="flex flex-col space-y-4 sm:flex-row sm:items-end sm:space-x-4 sm:space-y-0">
              <FormField
                control={form.control}
                name="paidBy"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Paid By</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>When</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal sm:w-[200px]",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? format(field.value, "MMMM d, yyyy")
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
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="splitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split</FormLabel>
                  <div className="mb-4">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        // Reset userSet when changing split type
                        setMembers(prevMembers => prevMembers.map(m => ({ ...m, userSet: false })));
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equally">Equally</SelectItem>
                        <SelectItem value="As Amounts">As Amounts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    className={`grid grid-cols-1 content-start gap-2 ${members.length < 3 ? "" : "max-h-[40vh] sm:max-h-[30vh]"} overflow-y-auto`}
                  >
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Switch
                            id={`member-${member.id}`}
                            className="mr-2"
                            checked={member.included}
                            onCheckedChange={(checked) =>
                              handleMemberToggle(member.id, checked)
                            }
                          />
                          <label htmlFor={`member-${member.id}`}>
                            {member.name} {member.isMe && "(me)"}
                          </label>
                        </div>
                        <div>
                          {watchSplitType === "As Amounts" ? (
                            <Input
                              type="number"
                              value={member.amount.toString()}
                              onChange={(e) => {
                                const value = e.target.value;
                                const amount = value.includes('.') ? parseFloat(value) : parseInt(value, 10);
                                handleAmountChange(member.id, isNaN(amount) ? 0 : amount);
                              }}
                              step="any"
                              className="w-20"
                              disabled={!member.included}
                            />
                          ) : (
                            `₹${member.amount.toFixed(2).replace(/\.00$/, '')}`
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <div className="flex flex-col justify-end space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Button
                type="submit"
                variant="outline"
                className="w-full rounded-md border-red-500 text-red-500 hover:bg-red-600 sm:w-auto"
              >
                Add Expense
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full rounded-md sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddExpense

