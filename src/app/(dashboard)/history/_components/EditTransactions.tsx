import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryTypes } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronDown, Loader2, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { editTransaction } from "@/actions/history/editTransaction";
import { useSearchParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; 
import { Description } from '@radix-ui/react-dialog';

const defaultCategories = [
  "Other", "Bills", "Food", "Entertainment", "Transportation",
  "EMI", "Healthcare", "Education", "Investment", "Shopping",
  "Fuel", "Groceries"
];

const CategoryTypesSchema = z.nativeEnum(CategoryTypes);

const baseSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a valid number greater than 0",
  }),
  transactionDate: z.date(),
});

const incomeSchema = baseSchema;
const expenseSchema = baseSchema.extend({
  category: CategoryTypesSchema,
});

type EditTransactionProps = {
  transaction: {
    id: string;
    userId: string;
    description: string | null;
    amount: number;
    date: Date;
    category: CategoryTypes | 'Income';
  };
  type: 'Expense' | 'Income';
};


export const EditTransaction: React.FC<EditTransactionProps> = ({ transaction, type }) => {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const schema = type === 'Income' ? incomeSchema : expenseSchema;
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      id: transaction.id,
      description: transaction.description || '',
      amount: transaction.amount.toString(),
      transactionDate: new Date(transaction.date),
      ...(type === 'Expense' ? { category: transaction.category } : {}),
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const response = await editTransaction({ transaction: { ...data, describe: data.description || "", userId: transaction.userId }, type });
      return response;
    },
    onSuccess: () => {
      toast.success(`${type} updated successfully`, {
        closeButton: true,
        icon: type === 'Income' ? "🤑" : "😤",
        duration: 4500,
      });
      setOpen(false);
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["transactions", from, to] });
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to update ${type}`, {
        closeButton: true,
      });
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (
      data.description === transaction.description &&
      data.amount === transaction.amount.toString() &&
      //@ts-ignore
      ((new Date(data.transactionDate).toISOString())===transaction.date)
    ) {
      toast.info("No changes are Made!!");
    }else{
      editMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <TooltipProvider> 
            <Tooltip>
              <TooltipTrigger asChild>
                {/* <Button variant="outline" onClick={()=>{setOpen(true);}}>
                  <Edit className="mr-2 h-4 w-4"/>
                  Edit
                </Button> */}
                {/* <Button
                  variant="outline"
                  onClick={() => { setOpen(true); }}
                  className="relative flex items-center justify-center space-x-2 p-2 border border-transparent rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 hover:from-blue-600 hover:to-blue-500 hover:shadow-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Edit
                    className="mr-2 h-4 w-4 text-white transition-colors duration-300 group-hover:text-blue-100"
                  />
                  <span className="text-white transition-colors duration-300 group-hover:text-blue-100">
                    Edit
                  </span>
                </Button> */}
                <Button
                  variant="outline"
                  onClick={() => { setOpen(true); }}
                  className="relative flex items-center justify-center space-x-2 p-2 border border-transparent rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 transition-all duration-300 hover:from-blue-800 hover:to-blue-700 hover:shadow-lg hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  <Edit
                    className="mr-2 h-4 w-4 text-white transition-colors duration-300 group-hover:text-blue-200"
                  />
                  <span className="text-white transition-colors duration-300 group-hover:text-blue-200">
                    Edit
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Transaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center sm:text-left">
              Edit <span className={type === 'Income' ? "text-green-500" : "text-red-500"}>{type.toLowerCase()}</span> transaction
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
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
              {type === 'Expense' && (
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
              )}
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
                <Button type="submit" className="w-full sm:w-auto" disabled={editMutation.isPending}>
                  {editMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    `Update ${type}`
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
};