"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { ScrollArea } from "@/components/ui/scroll-area"

import { categories, suggestCategory } from "@/lib/categoryKeywords"
import { cn } from "@/lib/utils"
import { CategoryTypes } from "@prisma/client"
import { AddnewExpense } from "../actions"

// form validation schema
const formSchema = z.object({
  description: z.string().optional(),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
  transactionDate: z.date(),
  category: z.nativeEnum(CategoryTypes),
})

export type ExpenseFormData = z.infer<typeof formSchema>

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

export function NewExpense() {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState<boolean>(false)
  const [suggestedCategory, setSuggestedCategory] = useState<CategoryTypes>(
    CategoryTypes.Other
  )

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      transactionDate: new Date(),
      category: CategoryTypes.Other,
    },
  })

  const description = form.watch("description")

  useEffect(() => {
    if (description) {
      const suggested = suggestCategory(description)
      setSuggestedCategory(suggested)

      // Always update the form value with the new suggestion
      form.setValue("category", suggested, { shouldValidate: true })
    } else {
      setSuggestedCategory("Other")
      form.setValue("category", "Other", { shouldValidate: true })
    }
  }, [description, form])

  const handleSubmit = async (data: ExpenseFormData) => {
    // console.log("Submitting data:", data)
    setIsPending(true)
    try {
      const result = await AddnewExpense(data)
      if (result === "success") {
        toast.success("Expense added successfully", {
          closeButton: true,
          icon: "😤",
          duration: 4500,
        })
        setOpen(false)
        form.reset({
          description: "",
          amount: "",
          transactionDate: new Date(),
          category: "Other",
        })
        setSuggestedCategory("Other")
      } else {
        throw new Error("Expense not added")
      }
    } catch (error) {
      console.error("Error adding Expense:", error)
      toast.error("Failed to add Expense")
    }
    setIsPending(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full  sm:w-[150px] border-red-500 text-red-500 hover:bg-red-700 hover:text-white"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          New Expense 😤
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            Create a new <span className="text-red-500">expense</span>{" "}
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
                          {categoryEmojis[field.value]}{" "}
                          {field.value ||
                            suggestedCategory ||
                            "Select a category"}
                          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <ScrollArea className="h-52 w-full">
                          {categories.map((category) => (
                            <DropdownMenuItem
                              key={category.name}
                              onSelect={() => {
                                field.onChange(category.name)
                                setSuggestedCategory(category.name)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  category.name === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {categoryEmojis[category.name]} {category.name}
                              {category.name === suggestedCategory &&
                                " (Suggested)"}
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
                className="w-full border-red-500 text-red-500 hover:bg-red-700 hover:text-white sm:w-auto"
                disabled={isPending}
              >
                {isPending ? "Adding..." : "Add new Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
