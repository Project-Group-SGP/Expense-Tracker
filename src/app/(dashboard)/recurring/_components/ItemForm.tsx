"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DatePicker } from "./DatePicker"
import { RecurringTransaction, Reminder } from "./types"
import { CategoryTypes } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface ItemFormProps {
  item: RecurringTransaction | Reminder | null
  onSubmit: (item: RecurringTransaction | Reminder) => void
  isTransaction: boolean
}

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

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  amount: z.number().positive({ message: "Amount must be positive" }),
  category: z.nativeEnum(CategoryTypes),
  description: z.string().optional(),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "CUSTOM"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dueDate: z.string().optional(),
  isActive: z.boolean(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
})

export const ItemForm: React.FC<ItemFormProps> = ({ item, onSubmit, isTransaction }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.description || "",
      amount: item?.amount || 0,
      category: (item?.category as CategoryTypes) || CategoryTypes.Other,
      description: item?.description || "",
      frequency: (item as RecurringTransaction)?.frequency,
      startDate: (item as RecurringTransaction)?.startDate?.toISOString().split("T")[0] || undefined,
      endDate: (item as RecurringTransaction)?.endDate?.toISOString().split("T")[0] || undefined,
      dueDate: (item as Reminder)?.dueDate ? new Date((item as Reminder).dueDate).toISOString().split("T")[0] : undefined,
      isActive: (item as RecurringTransaction)?.isActive ?? true,
      status: (item as Reminder)?.status || "PENDING",
    },
  })

  const submitHandler = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    
    const submittedItem = isTransaction
      ? {
          ...data,
          id: (item as RecurringTransaction)?.id || "",
          userId: (item as RecurringTransaction)?.userId || "",
          type: (item as RecurringTransaction)?.type || "EXPENSE",
          customInterval: (item as RecurringTransaction)?.customInterval,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          reminderEnabled: (item as RecurringTransaction)?.reminderEnabled || false,
          lastProcessed: (item as RecurringTransaction)?.lastProcessed,
          nextOccurrence: (item as RecurringTransaction)?.nextOccurrence || new Date(),
        } as RecurringTransaction
      : {
          ...data,
          id: (item as Reminder)?.id || "",
          userId: (item as Reminder)?.userId || "",
          type: (item as Reminder)?.type || "EXPENSE",
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        } as Reminder

    onSubmit(submittedItem)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto dark:bg-zinc-950 border-none shadow-none overflow-y-auto">
      <CardHeader>
        <CardTitle>{item ? "Edit" : "Add"} {isTransaction ? "Transaction" : "Reminder"}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter amount" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
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
                          <Button variant="outline" className="w-full justify-start">
                            {categoryEmojis[field.value as CategoryTypes]} {field.value || "Select category"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 h-40">
                          <ScrollArea className="h-72">
                            {Object.entries(categoryEmojis).map(([key, emoji]) => (
                              <DropdownMenuItem key={key} onSelect={() => field.onChange(key)}>
                                <Check className={`mr-2 h-4 w-4 ${field.value === key ? "opacity-100" : "opacity-0"}`} />
                                {emoji} {key}
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

              {isTransaction && (
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {isTransaction ? (
                <>
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value ? new Date(field.value) : undefined}
                            setDate={(date) => field.onChange(date.toISOString().split("T")[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value ? new Date(field.value) : undefined}
                            setDate={(date) => field.onChange(date.toISOString().split("T")[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value ? new Date(field.value) : undefined}
                          setDate={(date) => field.onChange(date.toISOString().split("T")[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {item ? "Update" : "Add"} {isTransaction ? "Transaction" : "Reminder"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

