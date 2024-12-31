"use client"

import React, {useEffect} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { DatePicker } from "./DatePicker"
import { RecurringTransaction, Reminder, } from "./types"
import { CategoryTypes, TransactionType } from "@prisma/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

const baseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  amount: z.number().positive({ message: "Amount must be positive" }),
  category: z.nativeEnum(CategoryTypes),
  isActive: z.boolean().optional(),
})

const transactionSchema = baseSchema.extend({
  type: z.nativeEnum(TransactionType),
  frequency: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "CUSTOM"]),
  customInterval: z.number().positive({ message: "Custom interval must be positive" }).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).refine(
  (data) => data.frequency !== "CUSTOM" || data.customInterval,
  { message: "Custom interval is required for custom frequency", path: ["customInterval"] }
)

const reminderSchema = baseSchema.extend({
  dueDate: z.string().optional(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]).optional(),
})

export const ItemForm: React.FC<ItemFormProps> = ({
  item,
  onSubmit,
  isTransaction,
}) => {
  const formSchema = isTransaction ? transactionSchema : reminderSchema

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || "",
      description: item?.description || "",
      amount: item?.amount || 0,
      category: item?.type === "INCOME" ? null : (item?.category as CategoryTypes),
      ...(isTransaction ? {
        type: (item as RecurringTransaction)?.type || TransactionType.EXPENSE,
        frequency: (item as RecurringTransaction)?.frequency,
        startDate: (item as RecurringTransaction)?.startDate?.toISOString().split("T")[0] || undefined,
        endDate: (item as RecurringTransaction)?.endDate?.toISOString().split("T")[0] || undefined,
        isActive: (item as RecurringTransaction)?.isActive ?? true,
        customInterval: (item as RecurringTransaction)?.customInterval,
      } : {
        dueDate: (item as Reminder)?.dueDate 
          ? new Date((item as Reminder).dueDate).toISOString().split("T")[0] 
          : undefined,
        status: (item as Reminder)?.status || "PENDING",
      }),
    },
  })

  const submitHandler = (data: any) => {
    // console.log(data)

    const submittedItem = isTransaction
      ? ({
          ...data,
          id: (item as RecurringTransaction)?.id || "",
          userId: (item as RecurringTransaction)?.userId || "",
          type: data.type,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
          reminderEnabled: (item as RecurringTransaction)?.reminderEnabled || false,
          lastProcessed: (item as RecurringTransaction)?.lastProcessed,
          nextOccurrence: data.startDate ? new Date(data.startDate) : new Date(),
          category: ( data.type === TransactionType.INCOME ? null : data.category ),
        } as RecurringTransaction)
      : ({
          ...data,
          id: (item as Reminder)?.id || "",
          userId: (item as Reminder)?.userId || "",
          type: (item as Reminder)?.type || TransactionType.EXPENSE,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        } as Reminder)

    onSubmit(submittedItem)
  }

  useEffect(() => {
    if (isTransaction && form.watch('type') === TransactionType.INCOME) {
      form.setValue('category', CategoryTypes.Other);
    }
  }, [form.watch('type'), isTransaction, form]);

  return (
    <Card className="mx-auto w-full max-w-2xl overflow-y-auto border-none shadow-none dark:bg-zinc-950">
      <CardContent className="overflow-y-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" className="cursor-text"  placeholder="Enter title" {...field} />
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
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isTransaction && (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={TransactionType.INCOME}>Income</SelectItem>
                          <SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={isTransaction && form.watch('type') === TransactionType.INCOME}>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            disabled={isTransaction && form.watch('type') === TransactionType.INCOME}
                          >
                            {categoryEmojis[field.value as CategoryTypes]}{" "}
                            {field.value || "Select category"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="h-40 w-56">
                          <ScrollArea className="h-72">
                            {Object.entries(categoryEmojis).map(
                              ([key, emoji]) => (
                                <DropdownMenuItem
                                  key={key}
                                  onSelect={() => field.onChange(key)}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${field.value === key ? "opacity-100" : "opacity-0"}`}
                                  />
                                  {emoji} {key}
                                </DropdownMenuItem>
                              )
                            )}
                          </ScrollArea>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isTransaction && (
                <>
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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
                            <SelectItem value="CUSTOM">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('frequency') === 'CUSTOM' && (
                    <FormField
                      control={form.control}
                      name="customInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Interval (Days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter custom interval"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
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
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            setDate={(date) =>
                              field.onChange(date.toISOString().split("T")[0])
                            }
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
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            setDate={(date) =>
                              field.onChange(date.toISOString().split("T")[0])
                            }
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
                          setDate={(date) =>
                            field.onChange(date.toISOString().split("T")[0])
                          }
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-5 w-full">
              {item ? "Update" : "Add"}{" "}
              {isTransaction ? "Transaction" : "Reminder"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

