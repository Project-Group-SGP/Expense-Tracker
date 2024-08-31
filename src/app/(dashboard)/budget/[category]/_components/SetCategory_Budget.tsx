"use client"

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
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
// import CategoryCard from ".../Card_Category"
import { CircleGauge } from "lucide-react"

import Card_budget from "./Card_budget"
import { SetCategoryBudgetDb } from "../../actions"


// form validation schema
const formSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
})

export type BudgetFormData = z.infer<typeof formSchema>

type SetCategroy_BudgetProps = {
  currentBudget: number,
  category: string
}

export function SetCategroy_Budget(prop:SetCategroy_BudgetProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: prop.currentBudget.toString(),
    },
  })

  // form handler
  const handleSubmit = async (data: BudgetFormData) => {
    try {
      
      // For now, we'll just simulate a successful update
      // await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulating API call

      const budget = Number(data.amount);

      const result = await SetCategoryBudgetDb(prop.category ,budget);

      if(result == "success"){
        toast.success("Budget updated successfully", {
          closeButton: true,
          icon: "💰",
          duration: 4500,
        })
        form.reset();
      }else{
        toast.error("Budget not set");
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
      <div onClick={() => setOpen(true)}>
        <DialogTrigger asChild>
          <Card_budget
            title="Set Budget"
            amount={prop.currentBudget}
            color="text-blue-700"
            icon={CircleGauge}
            class = "cursor-pointer"
            />

        </DialogTrigger>
            </div>

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
