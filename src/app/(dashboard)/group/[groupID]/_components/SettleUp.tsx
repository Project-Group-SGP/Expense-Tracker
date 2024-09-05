"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import * as z from "zod";
import { toast } from "sonner";
import { UserAvatar } from "./UserAvatar";

// Define the form schema using Zod
const formSchema = z
  .object({
    fromUser: z.number().min(1, "Please select a valid payer."),
    toUser: z.number().min(1, "Please select a valid recipient."),
    amount: z.string().refine(
      (val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed) && parsed > 0;
      },
      {
        message: "Amount must be a valid number greater than 0",
      }
    ),
    transactionDate: z.date().refine((date) => date <= new Date(), {
      message: "Transaction date cannot be in the future",
    }),
    notes: z.string().optional(),
    group: z.string().optional(),
  })
  .refine((data) => data.fromUser !== data.toUser, {
    message: "Payer and recipient cannot be the same person",
    path: ["toUser"], // Add the error to the 'toUser' field
  });

// Define types for the form schema
type FormSchema = z.infer<typeof formSchema>;

// Define the User interface
interface User {
  id: number;
  name: string;
  avatar?: string;
}

// Users -> which have to pay the bill from current user
const users: User[] = [
  { id: 1, name: "Ayush Kalathiya" },
  { id: 2, name: "Sarthak" },
  { id: 3, name: "Meet" },
  { id: 4, name: "Mit" },
  { id: 5, name: "Ayush Kalathiya" },
  { id: 6, name: "Sarthak" },
  { id: 7, name: "Vandit" },
  { id: 8, name: "Kotak" },
];

// User Avatar
export const UserSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: User) => void;
}> = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Member</DialogTitle>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto pb-5">
          <div className="grid grid-cols-2 gap-4">
            {users.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="flex h-full items-center justify-start space-x-2 p-2"
                onClick={() => {
                  onSelect(user);
                  onClose();
                }}
              >
                <UserAvatar user={user} size={40} />
                <span className="truncate text-sm">{user.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function SettleUp() {
  const [open, setOpen] = useState(false);
  const [userSelectionOpen, setUserSelectionOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"fromUser" | "toUser" | null>(null);

  // Initialize the form
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromUser: users[0].id,
      toUser: users[1].id,
      amount: "",
      transactionDate: new Date(),
      notes: "",
      group: "No group",
    },
  });

  // Handle form submission
  const handleSubmit = async (data: FormSchema) => {
    try {
      console.log("Form submitted:", data);

      toast.success("Settling up...", {
        closeButton: true,
        icon: "🤝",
        duration: 4500,
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error settling up", {
        closeButton: true,
        icon: "❌",
        duration: 4500,
      });
    }
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    if (selectingFor) {
      form.setValue(selectingFor, user.id);
    }
    setUserSelectionOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-[150px] border-green-500 text-green-500 hover:bg-green-700 hover:text-white"
          variant="outline"
          onClick={() => setOpen(true)} // Open the dialog
        >
          Settle up 🤝
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            <span className="text-green-500">Settle up</span> 🤝
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <UserAvatar
                user={users.find((u) => u.id === form.watch("fromUser")) || users[0]}
                size={85}
              />
              <div className="text-2xl">→</div>
              <FormField
                control={form.control}
                name="toUser"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-24 w-24 rounded-full border-none p-0"
                        onClick={() => {
                          setSelectingFor("toUser");
                          setUserSelectionOpen(true);
                        }}
                      >
                        <UserAvatar
                          user={users.find((u) => u.id === field.value) || users[1]}
                          size={85}
                        />
                      </Button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-center">
              <span className="text-green-500">
                {users.find((u) => u.id === form.watch("fromUser"))?.name}
              </span>{" "}
              paid{" "}
              <span className="text-blue-500">
                {users.find((u) => u.id === form.watch("toUser"))?.name}
              </span>
            </div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="₹ 0"
                      className="text-center text-3xl font-bold"
                    />
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
                            "w-full pl-3 text-left font-normal sm:w-[360px]",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
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
                className="ml-2 border-green-500 text-green-500 hover:bg-green-600"
              >
                Settle up
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      <UserSelectionModal
        isOpen={userSelectionOpen}
        onClose={() => setUserSelectionOpen(false)}
        onSelect={handleUserSelect}
      />
    </Dialog>
  );
}

export default SettleUp;
