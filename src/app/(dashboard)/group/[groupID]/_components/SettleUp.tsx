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
    fromUser: z.string().min(1, "Please select a valid payer."),
    toUser: z.string().min(1, "Please select a valid recipient."),
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
    path: ["toUser"],
  });

// Define types for the form schema
type FormSchema = z.infer<typeof formSchema>;

interface GroupMember {
  userId: string;
  name: string;
  avatar: string;
}

// Define the User interface
interface SettleUpProps {
  groupMemberName: GroupMember[];
}

export const UserSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (user: GroupMember) => void;
  groupMemberName: GroupMember[];
}> = ({ isOpen, onClose, onSelect, groupMemberName }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Member</DialogTitle>
        </DialogHeader>
        <div className="max-h-[50vh] overflow-y-auto pb-5">
          <div className="grid grid-cols-2 gap-4">
            {groupMemberName.map((user) => (
              <Button
                key={user.userId}
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

export function SettleUp({ groupMemberName }: SettleUpProps) {
  const [open, setOpen] = useState(false);
  const [userSelectionOpen, setUserSelectionOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"fromUser" | "toUser" | null>(null);

  // Initialize the form
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromUser: groupMemberName[0]?.userId || "",
      toUser: groupMemberName[1]?.userId || "",
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
  const handleUserSelect = (user: GroupMember) => {
    if (selectingFor) {
      form.setValue(selectingFor, user.userId);
    }
    setUserSelectionOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-[150px] border-green-500 text-green-500 hover:bg-green-700 hover:text-white"
          variant="outline"
          onClick={() => setOpen(true)}
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
                user={groupMemberName.find((u) => u.userId === form.watch("fromUser")) || groupMemberName[0]}
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
                          user={groupMemberName.find((u) => u.userId === field.value) || groupMemberName[1]}
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
                {groupMemberName.find((u) => u.userId === form.watch("fromUser"))?.name}
              </span>{" "}
              paid{" "}
              <span className="text-blue-500">
                {groupMemberName.find((u) => u.userId === form.watch("toUser"))?.name}
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
        groupMemberName={groupMemberName}
      />
    </Dialog>
  );
}

export default SettleUp;
