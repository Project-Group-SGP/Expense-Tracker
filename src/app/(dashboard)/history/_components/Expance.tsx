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
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { CategoryTypes } from "@prisma/client"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronDown } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { AddnewExpense } from "../action"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const defaultCategories = [
  "Other",
  "Bills",
  "Food",
  "Entertainment",
  "Transportation",
  "EMI",
  "Healthcare",
  "Education",
  "Investment",
  "Shopping",
  "Fuel",
  "Groceries",
]

const CategoryTypesSchema = z.nativeEnum(CategoryTypes)

const formSchema = z.object({
  description: z.string().optional(),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
  transactionDate: z.date(),
  category: CategoryTypesSchema,
})

export type ExpenseFormData = z.infer<typeof formSchema>

export function NewExpense() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      transactionDate: new Date(),
    },
  })

  const addExpenseMutation = useMutation({
    mutationFn: AddnewExpense,
    onSuccess: () => {
      toast.success("Expense added successfully", {
        closeButton: true,
        icon: "😤",
        duration: 4500,
      })
      setOpen(false)
      form.reset()
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
    onError: (error) => {
      console.error("Error adding expense:", error)
      toast.error("Failed to add expense")
    },
  })

  const handleSubmit = (data: ExpenseFormData) => {
    addExpenseMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-[150px] border-red-500 text-red-500 hover:bg-red-700 hover:text-white"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          New Expense 😤
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            Create a new <span className="text-red-500">expense</span> transaction
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 space-y-4">
              {/* Description */}
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

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {field.value || "Select a category"}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          <ScrollArea className="h-52 w-full">
                            {defaultCategories.map((category) => (
                              <DropdownMenuItem
                                key={category}
                                onSelect={() => field.onChange(category)}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    category === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {category}
                              </DropdownMenuItem>
                            ))}
                          </ScrollArea>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transaction Date */}
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
              <Button type="submit" className="w-full sm:w-auto" disabled={addExpenseMutation.isPending}>
                {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}