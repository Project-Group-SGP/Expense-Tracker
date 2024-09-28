"use client"
import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { CircleGauge, AlertCircle, X } from "lucide-react"

import Card_budget from "./Card_budget"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SetCategoryBudgetDb } from "../action"
import { CategoryTypes } from "@prisma/client"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
})

export type BudgetFormData = z.infer<typeof formSchema>

type SetCategory_BudgetProps = {
  currentBudget: number
  category: string
  expense: number
}

export function SetCategory_Budget(props: SetCategory_BudgetProps) {
  const [open, setOpen] = useState(false)
  const [toastShown, setToastShown] = useState(false)
  const [isPending, setisPending] = useState<boolean>(false)

  const router = useRouter()

  // console.log("Current budget:", props.currentBudget)

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: props.currentBudget.toString(),
    },
  })

  const showWarningToast = useCallback(() => {
    toast.custom(
      (t) => (
        <Alert className="relative w-full max-w-md border-none border-red-800 bg-red-600 shadow-lg">
          <AlertTitle className="flex items-center text-[13px] font-bold text-white">
            <AlertCircle className="mr-2 h-6 w-6 text-red-200" />
            Warning: Budget Exceeded!
          </AlertTitle>
          <AlertDescription className="mt-2 text-[12px] text-red-100">
            You've exceeded your budget! Please review your expenses.
          </AlertDescription>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-2 top-2 text-red-100 hover:bg-red-700 hover:text-white"
            onClick={() => toast.dismiss(t)}
          >
            <X className="h-5 w-5" />
          </Button>
        </Alert>
      ),
      {
        duration: 5000,
        position: "top-right",
      }
    )
    setToastShown(true)
  }, [])

  useEffect(() => {
    if (
      !toastShown &&
      props.expense &&
      props.currentBudget &&
      props.currentBudget < props.expense
    ) {
      showWarningToast()
    }
  }, [props.currentBudget, props.expense, toastShown, showWarningToast])

  const handleSubmit1 = async (data: BudgetFormData) => {
    const budget = Number(data.amount)

    function toCategoryType(category: string): CategoryTypes {
      // Convert both the input category and enum values to uppercase for comparison
      const normalizedCategory = category.toUpperCase()

      // Convert enum values to uppercase for comparison
      const categoryEnumUppercaseMap = Object.values(CategoryTypes).reduce(
        (acc, enumValue) => {
          acc[enumValue.toString().toUpperCase()] = enumValue
          return acc
        },
        {} as Record<string, CategoryTypes>
      )

      // Check if the normalized category exists in the enum map
      if (categoryEnumUppercaseMap[normalizedCategory]) {
        return categoryEnumUppercaseMap[normalizedCategory]
      }

      // Return 'Other' as a fallback if no match is found
      return CategoryTypes.Other
    }

    try {
      // Assuming you have a way to get the category (you might need to pass it in or get it from props)
      const category = toCategoryType(props.category)

      // console.log("category : " + category)
      // console.log("budget : " + budget)

      // Update the category budget
      const result = await SetCategoryBudgetDb(category, budget)

      if (result == "success") {
        toast.success("Budget updated successfully", {
          closeButton: true,
          icon: "💰",
          duration: 4500,
        })
        form.reset()

        // Close modal or dialog if applicable
        setOpen(false)

        // Reset form state
        form.reset({ amount: data.amount })
        router.refresh()
      } else {
        console.error("Error updating budget:", result)
        toast.error("Budget update failed")
      }

      // Reset toastShown state if applicable
      setToastShown(false)
    } catch (error) {
      console.error("Error updating budget:", error)
      toast.error("Failed to update budget")
    }
  }

  const handleSubmit = async (data: BudgetFormData) => {
    setisPending(true)
    await handleSubmit1(data)
    setisPending(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>
          <Card_budget
            title="Set Budget"
            amount={props.currentBudget}
            color="text-blue-700"
            icon={CircleGauge}
            class="cursor-pointer"
          />
        </div>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            Set a new <span className="text-green-500">Budget</span>
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
                  <FormLabel>Budget Amount</FormLabel>
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
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update Budget"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
