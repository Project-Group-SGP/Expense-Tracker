"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RecurringTransactions } from "./_components/RecurringTransactions"
import { Reminders } from "./_components/Reminders"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ItemForm } from "./_components/ItemForm"
import {
  getRecurringTransactions,
  getReminders,
  addItem,
  editItem,
  deleteItem,
} from "./action"
import { RecurringTransaction, Reminder } from "./_components/types"
import { toast } from "sonner"
import { SkeletonLoader } from "./_components/SkeletonLoader"

export default function RecurringTransactionsAndReminders() {
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<
    RecurringTransaction | Reminder | null
  >(null)
  const [activeTab, setActiveTab] = useState<"transactions" | "reminders">(
    "transactions"
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    const fetchedTransactions = await getRecurringTransactions()
    const fetchedReminders = await getReminders()
    setTransactions(fetchedTransactions)
    setReminders(fetchedReminders)
    setIsLoading(false)
  }

  const handleAddItem = async (newItem: RecurringTransaction | Reminder) => {
    
    try {
      let isFrequency = 'frequency' in newItem && newItem.frequency !== undefined;
      let loading: any;
      if (isFrequency) {
        loading = toast.loading("Adding Recurring transactions...")
      }else{
        loading = toast.loading("Adding Reminder...")
      }

      setIsDialogOpen(false)
      const response = await addItem(newItem)
      // console.log(response);
      
      await fetchData()
    
      if(response){
        if(isFrequency){

          toast.success("Recurring transactions added successfully", {
            closeButton: true,
            icon: "🔄",
            duration: 4500,
            id: loading,
          })
        }else{
          toast.success("Reminder added successfully", {
            closeButton: true,
            icon: "🔔",
            duration: 4500,
            id: loading,
          })
        }
      }

    } catch (error) {
      toast.error("Error Adding Recurring transactions", {
        closeButton: true,
        icon: "❌",
        duration: 4500,
      })
    }
  }

  const handleEditItem = async (
    updatedItem: RecurringTransaction | Reminder
  ) => {
    try {
      let isFrequency = 'frequency' in updatedItem && updatedItem.frequency !== undefined;
      // console.log(updatedItem);
      
      // console.log(isFrequency);
      
      let loading: any;
      if (isFrequency) {
        loading = toast.loading("Updating Recurring transactions...")
      }else{
        loading = toast.loading("Updating Reminder ...")
      }
      setIsDialogOpen(false)
      await editItem(updatedItem);
      await fetchData()
      setEditingItem(null)

      if (isFrequency) {
        toast.success("Recurring transactions updated successfully", {
          closeButton: true,
          icon: "🔄",
          duration: 4500,
          id: loading,
        })
      }else{
        toast.success("Reminder updated successfully", {
          closeButton: true,
          icon: "🔔",
          duration: 4500,
          id: loading,
        })
      }
    } catch (error) {
     toast.error("Error while Updating....", {
        closeButton: true,
        icon: "❌",
        duration: 4500,
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {

      let loading: any 
      if(activeTab === "reminders"){
        loading = toast.loading("Deleting Reminder...")
      }else{
        loading = toast.loading("Deleting Recurring transactions...")
      }
      await deleteItem(id)
      await fetchData()
      if(activeTab === "reminders"){
        toast.success("Reminder deleted successfully", {
          closeButton: true,
          icon: "🔔",
          duration: 4500,
          id: loading,
        })
      }else{
       toast.success("Recurring transactions deleted successfully", {
          closeButton: true,
          icon: "🔄",
          duration: 4500,
          id: loading,
        })
      }
    } catch (error) {
      toast.error("Error Deleting Recurring transactions", {
        closeButton: true,
        icon: "❌",
        duration: 4500,
      })
    }
  }

  return (
    <div className="m-2">
      <Card className="mx-auto mt-20 w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Recurring Transactions and Reminders
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Manage your recurring transactions and payment reminders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "transactions" | "reminders")
            }
            className="w-full"
          >
            <div className="mb-4 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger
                  value="transactions"
                  className="flex-1 sm:flex-none"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="reminders" className="flex-1 sm:flex-none">
                  Reminders
                </TabsTrigger>
              </TabsList>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add {activeTab === "transactions" ? "Transaction" : "Reminder"}
              </Button>
            </div>
            <TabsContent value="transactions">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <RecurringTransactions
                initialTransactions={transactions}
                update_Transactions={setTransactions}
                  onEdit={(item) => {
                    setEditingItem(item)
                    setIsDialogOpen(true)
                  }}
                  onDelete={handleDeleteItem}
                />
              )}
            </TabsContent>
            <TabsContent value="reminders">
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <Reminders
                  reminders={reminders}
                  onEdit={(item) => {
                    setEditingItem(item)
                    setIsDialogOpen(true)
                  }}
                  onDelete={handleDeleteItem}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[95vh] w-[95vw] overflow-y-auto rounded-lg sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit" : "Add"}{" "}
                {activeTab === "transactions" ? "Transaction" : "Reminder"}
              </DialogTitle>
              <DialogDescription>
                Enter the details for your{" "}
                {activeTab === "transactions"
                  ? "recurring transaction"
                  : "payment reminder"}
                .
              </DialogDescription>
            </DialogHeader>
            <ItemForm
              item={editingItem}
              onSubmit={editingItem ? handleEditItem : handleAddItem}
              isTransaction={activeTab === "transactions"}
            />
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}

