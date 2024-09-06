"use client"
import React, { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { AddGroupExpense } from "../group"
import { toast } from "sonner"

// Enum for Category Types
enum CategoryTypes {
  Other = "Other",
  Bills = "Bills",
  Food = "Food",
  Entertainment = "Entertainment",
  Transportation = "Transportation",
  EMI = "EMI",
  Healthcare = "Healthcare",
  Education = "Education",
  Investment = "Investment",
  Shopping = "Shopping",
  Fuel = "Fuel",
  Groceries = "Groceries",
}

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
  category: z.nativeEnum(CategoryTypes),
})

// category selector
const CategorySelector = ({ selectedCategory, onCategoryChange }) => {
  return (
    <Select value={selectedCategory} onValueChange={onCategoryChange}>
      <SelectTrigger className="w-[70px]">
        <SelectValue>
          {categoryEmojis[selectedCategory] || "Select a category"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="h-60">
        {Object.values(CategoryTypes).map((category) => (
          <SelectItem key={category} value={category}>
            {categoryEmojis[category]} {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

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

  // State for members
  const [members, setMembers] = useState<
    {
      id: string
      name: string
      avatar: string
      included: boolean
      isMe: boolean
      amount: number
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
      category: CategoryTypes.Food,
    },
  })

  const watchAmount = form.watch("amount")
  const watchSplitType = form.watch("splitType")

  useEffect(() => {
    const totalAmount = parseFloat(watchAmount) || 0
    const splitType = watchSplitType

    const includedMembers = members.filter((m) => m.included)
    let updatedMembers = [...members]

    if (splitType === "Equally") {
      const splitAmount = totalAmount / includedMembers.length
      updatedMembers = updatedMembers.map((member) => ({
        ...member,
        amount: member.included ? splitAmount : 0,
      }))
    }

    const hasChanged =
      JSON.stringify(members) !== JSON.stringify(updatedMembers)
    if (hasChanged) {
      setMembers(updatedMembers)
      form.setValue("splitWith", updatedMembers)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAmount, watchSplitType])

  const handleMemberToggle = (id: string, included: boolean) => {
    const updatedMembers = members.map((m) =>
      m.id === id ? { ...m, included } : m
    )
    setMembers(updatedMembers)
    form.setValue("splitWith", updatedMembers)
  }

  // Form submission
  const onSubmit = async (data) => {
    console.log(data)

    const groupId = params.groupID
    const paidById = members.find((member) => member.name === data.paidBy)?.id

    if (!paidById) {
      console.error("PaidBy user ID not found")
      return
    }

    const splits = data.splitWith.map((member) => ({
      userId: member.id,
      amount: member.amount || 0,
    }))

    const loading = toast.loading("Adding Expense...")
    setOpen(false)
    try {
      const response = await AddGroupExpense({
        groupID: groupId,
        paidById: String(paidById),
        title: data.title,
        amount: parseFloat(data.amount),
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
          className="w-[150px] border-red-500 text-red-500 hover:bg-red-700 hover:text-white"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          Add an Expense 😤
        </Button>
      </DialogTrigger>

      <DialogContent className="scale-2 h-[90vh] overflow-y-auto sm:w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            <span className="text-red-500">Add an Expense</span> 😤
          </DialogTitle>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full space-y-4"
          >
            {/* category */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <div className="flex gap-2">
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
                        <CategorySelector
                          selectedCategory={form.watch("category")}
                          onCategoryChange={(value) =>
                            form.setValue("category", value)
                          }
                        />
                      )}
                    />
                  </div>
                </FormItem>
              )}
            />

            {/* amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Amount</FormLabel>
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
                          field.onChange(e)
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* paid by */}
            <div className="flex items-end space-x-4">
              <FormField
                control={form.control}
                name="paidBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid By</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
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

              {/* date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>When</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-[180px] pl-3 text-left font-normal",
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

            {/* split type */}
            <FormField
              control={form.control}
              name="splitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split</FormLabel>
                  <div className="mb-4 flex items-center justify-between">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equally">Equally</SelectItem>
                        <SelectItem value="As Amounts">As Amounts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
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
                              value={member.amount}
                              onChange={(e) => {
                                const updatedMembers = members.map((m) =>
                                  m.id === member.id
                                    ? {
                                        ...m,
                                        amount: parseFloat(e.target.value),
                                      }
                                    : m
                                )
                                setMembers(updatedMembers)
                                form.setValue("splitWith", updatedMembers)
                              }}
                              className="w-20"
                            />
                          ) : (
                            `₹${member.amount.toFixed(2)}`
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Button */}
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-600"
              >
                Add Expense
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddExpense
