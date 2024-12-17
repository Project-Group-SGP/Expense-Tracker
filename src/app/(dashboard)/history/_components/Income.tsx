// "use client"

// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
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
// import { Input } from "@/components/ui/input"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"
// import * as z from "zod"
// import { cn } from "@/lib/utils"
// import { format } from "date-fns"
// import { CalendarIcon } from "lucide-react"
// import { AddnewIncome } from "../action"
// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { useSearchParams } from "next/navigation"

// // form validation schema
// const formSchema = z.object({
//   description: z.string().optional(),
//   amount: z
//     .string()
//     .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
//       message: "Amount must be a valid number greater than 0",
//     }),
//   transactionDate: z.date(),
// })

// export type IncomeFormData = z.infer<typeof formSchema>

// export function Newincome() {
//   const [open, setOpen] = useState(false)
//   const queryClient = useQueryClient()
//   const params = useSearchParams();
//   const from = params.get("from") || "";
//   const to = params.get("to") || "";

//   const form = useForm<IncomeFormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       description: "",
//       amount: "",
//       transactionDate: new Date(),
//     },
//   })

//   const addIncomeMutation = useMutation({
//     mutationFn: AddnewIncome,
//     onSuccess: () => {
//       toast.success("Income added successfully", {
//         closeButton: true,
//         icon: "🤑",
//         duration: 4500,
//       })
//       setOpen(false)
//       // Invalidate and refetch
//       queryClient.invalidateQueries({ queryKey: ["transactions",from,to] })
//       form.reset()
//     },
//     onError: (error) => {
//       console.error("Error adding income:", error)
//       toast.error("Failed to add income")
//     },
//   })

//   const handleSubmit = (data: IncomeFormData) => {
//     addIncomeMutation.mutate(data)
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           className="w-full border-green-500 text-green-500 hover:bg-green-700 hover:text-white sm:w-[150px]"
//           variant="outline"
//         >
//           New Income 🤑
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
//         <DialogHeader>
//           <DialogTitle className="text-center sm:text-left">
//             Create a new <span className="text-green-500">income</span> transaction
//           </DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
//             {/* Description */}
//             <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description (Optional)</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter description" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Amount */}
//               <FormField
//                 control={form.control}
//                 name="amount"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Amount</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter amount"
//                         type="number"
//                         step="0.01"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               {/* Transaction Date */}
//               <FormField
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
//                               "w-full pl-3 text-left font-normal sm:w-[240px]",
//                               !field.value && "text-muted-foreground"
//                             )}
//                           >
//                             {field.value ? (
//                               format(field.value, "PPP")
//                             ) : (
//                               <span>Pick a date</span>
//                             )}
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
//               />
//             <DialogFooter className="mt-6 sm:mt-8">
//               <Button type="submit" className="w-full sm:w-auto" disabled={addIncomeMutation.isPending}>
//                 {addIncomeMutation.isPending ? "Adding..." : "Add new income"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { AddnewIncome } from "../action"
import { useRouter } from "next/navigation"

// form validation schema
const formSchema = z.object({
  description: z.string().optional(),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
  transactionDate: z.date(),
})

export type IncomeFormData = z.infer<typeof formSchema>

interface NewIncomeProps {
  onAdd: (data: IncomeFormData) => void
}

export function Newincome() {
  const [open, setOpen] = useState(false)
  const [isPending, setisPending] = useState<boolean>(false)

  const router = useRouter()

  const form = useForm<IncomeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      transactionDate: new Date(),
    },
  })

  const onAdd = async (data: IncomeFormData) => {
    try {
      const responce = await AddnewIncome(data)
      if (responce === "success") {
        toast.success("Income added successfully", {
          closeButton: true,
          icon: "🤑",
          duration: 4500,
        })

        setOpen(false)
        router.refresh()
        form.reset()
      } else {
        throw new Error("Income not added")
      }
    } catch (error) {
      console.error("Error adding expense:", error)
      toast.error("Failed to add income")
    }
  }

  const handleSubmit = async (data: IncomeFormData) => {
    setisPending(true)
    await onAdd(data)
    setisPending(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full border-green-500 text-green-500 hover:bg-green-700 hover:text-white sm:w-[150px]"
          variant="outline"
        >
          New Income 🤑
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            Create a new <span className="text-green-500">income</span>{" "}
            transaction
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount"
                      type="number"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
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
                            "w-full pl-3 text-left font-normal sm:w-[240px]",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
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
            <DialogFooter className="mt-6 sm:mt-8">
              <Button
                type="submit"
                variant="outline"
                className="w-full border-green-500 text-green-500 hover:bg-green-700 sm:w-auto"
                disabled={isPending}
              >
                {isPending ? "Adding..." : "Add new income"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
