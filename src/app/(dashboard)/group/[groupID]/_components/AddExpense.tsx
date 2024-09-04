"use client"

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// Adjust the path based on your file structure
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserSelectionModal } from "./SettleUp"; // Ensure this component is correctly imported
import { cn } from "@/lib/utils";

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

// form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a valid number greater than 0",
    }),
  paidBy: z.string(),
  date: z.date(),
  splitType: z.enum(["Equally", "As Parts", "As Amounts"]),
  splitWith: z
    .array(z.string())
    .min(1, "At least one person must be selected to split with"),
  category: z.nativeEnum(CategoryTypes) // Add category to the form schema
});



// Mapping categories to emojis
const categoryEmojis: Record<CategoryTypes, string> = {
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

interface CategorySelectorProps {
  selectedCategory: CategoryTypes;
  onCategoryChange: (value: CategoryTypes) => void;
}

function CategorySelector({ selectedCategory, onCategoryChange }: CategorySelectorProps) {
  const [localCategory, setLocalCategory] = useState(selectedCategory);

  useEffect(() => {
    setLocalCategory(selectedCategory);
  }, [selectedCategory]);

  const handleChange = (value: string) => {
    const category = CategoryTypes[value as keyof typeof CategoryTypes];
    setLocalCategory(category);
    onCategoryChange(category);
  };

  return (
    <Select value={localCategory} onValueChange={handleChange}>
      <SelectTrigger className="w-[70px]">
        <SelectValue>
          {categoryEmojis[localCategory] || "Select a category"}
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
  );
}


// AddExpense
export function AddExpense() {
  const [open, setOpen] = useState(false);
  const [userSelectionOpen, setUserSelectionOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      paidBy: "Ayush (me)",
      date: new Date(),
      splitType: "Equally",
      splitWith: ["Ayush (me)"],
      category: CategoryTypes.Food, // Default category value
    },
  });

  // Handle form submission
  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission, such as sending data to the server
    setOpen(false);
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    form.setValue("paidBy", user);
  };

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
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            <span className="text-red-500">Add an Expense</span> 😤
          </DialogTitle>
        </DialogHeader>
        
        {/* from */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Title</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="E.g. Drinks"
                        {...field}
                        className="flex-grow"
                      />
                    </FormControl>
                    
                      <CategorySelector
                        selectedCategory={form.getValues("category")}
                        onCategoryChange={(category) => form.setValue("category", category)}
                      />
                   
                  </div>
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Amount</FormLabel>
                  <div className="flex">
                    <Select
                      defaultValue="₹"
                      onValueChange={(val) =>
                        console.log(`Currency changed to ${val}`)
                      }
                    >
                      <SelectTrigger className="w-[60px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="₹">₹</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        className="ml-2 flex-grow"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Paid By */}
            <div className="flex justify-between">
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
                      <SelectTrigger
                        className="w-[140px]"
                        onClick={() => setUserSelectionOpen(true)}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ayush (me)">Ayush (me)</SelectItem>
                        {/* Add other options as needed */}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />


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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>


            {/* Split Type */}
            <FormField
              control={form.control}
              name="splitType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Split</FormLabel>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Switch
                        id="split-type-switch"
                        className="mr-2"
                        checked={field.value !== "Equally"}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? "As Parts" : "Equally")
                        }
                      />
                      <label htmlFor="split-type-switch">Ayush (me)</label>
                    </div>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equally">Equally</SelectItem>
                        <SelectItem value="As Parts">As Parts</SelectItem>
                        <SelectItem value="As Amounts">As Amounts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </FormItem>
              )}
            />


            {/* Buttons */}
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
      {/* <UserSelectionModal
        isOpen={userSelectionOpen}
        onClose={() => setUserSelectionOpen(false)}
        onSelect={handleUserSelect}
      /> */}
    </Dialog>
  );
}

export default AddExpense;
