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
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"


const defaultCategories = [
  "EMI",
  "Bills",
  "Groceries",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Health",
  "Education",
  "Other",
]

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

export function Setbuget() {
  const form = useForm<IncomeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      transactionDate: new Date(),
    },
  })

  const [open, setOpen] = useState(false)
  // handle submit
  const handleSubmit = async (data: IncomeFormData) => {
    // try {
    //   const result = await AddnewIncome(data)

    //   if (result === "success") {
    //     toast.success("Income added successfully", {
    //       closeButton: true,
    //       icon: "🤑",
    //       duration: 4500,
    //     })

    //     setOpen(false)
    //     form.reset()
    //   } else {
    //     throw new Error("Income not added")
    //   }
    // } catch (error) {
    //   console.error("Error adding income:", error)
    //   toast.error("Failed to add income")
    // }
  }

  const [categories, setCategories] = useState(defaultCategories)
  // const [newCategory, setNewCategory] = useState("")
  // const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)

  return (
    // useing state to open dialog
    <Dialog open={open} onOpenChange={setOpen}>
      <div>
        {/* New Income button */}
        <DialogTrigger asChild>
          <Button
            className="w-full border-green-500 text-green-500 hover:bg-green-700 hover:text-white sm:w-[150px]"
            variant="outline"
          >
            Set Budget 
          </Button>
        </DialogTrigger>

        {/* Dialog of New Income */}
        <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center sm:text-left">
              Set a new <span className="text-green-500">Budget</span>{" "}
            </DialogTitle>
          </DialogHeader>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                console.log("Form validation errors:", errors)
              })}
              className="mt-4 space-y-4"
            >
              {/* Description */}
              {/* <FormField
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
              /> */}

              {/* Amount */}
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
             
              <DialogFooter className="mt-6 sm:mt-8">
                <Button type="submit" className="w-full sm:w-auto">
                  Set New Budget
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </div>
    </Dialog>
  )
}
