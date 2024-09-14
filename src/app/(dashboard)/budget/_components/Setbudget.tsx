"use client"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Wallet, CircleGauge, AlertCircle, X } from "lucide-react"
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
import CategoryCard from "./Card_Category"
import { SetBudgetDb } from "../actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
})

export type BudgetFormData = z.infer<typeof formSchema>

export function SetBudget({
  currentBudget,
  expense,
}: {
  currentBudget: number
  expense: number
}) {
  const [open, setOpen] = useState(false)
  const [toastShown, setToastShown] = useState(false)

  const router = useRouter();

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: currentBudget.toString(),
    },
  })

  // Show warning toast when expense exceeds budget
  useEffect(() => {
    if (!toastShown && expense && currentBudget && currentBudget < expense) {
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
    }
  }, [currentBudget, expense, toastShown])

  const handleSubmit = async (data: BudgetFormData) => {
    try {
      const budget = Number(data.amount)
      const result = await SetBudgetDb(budget);

      if (result === "success") {
        toast.success("Budget updated successfully", {
          closeButton: true,
          icon: "💰",
          duration: 4500,
        })

        router.refresh()

        form.reset()
      } else {
        toast.error("Budget update failed")
      }

      setOpen(false)
      form.reset({ amount: data.amount })
    } catch (error) {
      console.error("Error updating budget:", error)
      toast.error("Failed to update budget")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)}>
          <CategoryCard
            title="Budget"
            amount={currentBudget}
            color="text-blue-700"
            icon={CircleGauge}
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
              <Button type="submit" className="w-full sm:w-auto">
                Update Budget
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
