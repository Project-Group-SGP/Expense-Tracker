"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RecurringTransactions } from "./_components/RecurringTransactions"
import { Reminders } from "./_components/Reminders"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ItemForm } from "./_components/ItemForm"
import { useToast } from "@/hooks/use-toast"
import { 
  getRecurringTransactions, 
  getReminders, 
  addItem, 
  editItem, 
  deleteItem 
} from "./action"
import { RecurringTransaction, Reminder } from "./_components/types"

export default function RecurringTransactionsAndReminders() {
  const [transactions, setTransactions] = useState<RecurringTransaction[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RecurringTransaction | Reminder | null>(null)
  const [activeTab, setActiveTab] = useState<"transactions" | "reminders">("transactions")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const fetchedTransactions = await getRecurringTransactions()
    const fetchedReminders = await getReminders()
    setTransactions(fetchedTransactions)
    setReminders(fetchedReminders)
  }

  const handleAddItem = async (newItem: RecurringTransaction | Reminder) => {
    try {
      await addItem(newItem)
      await fetchData()
      setIsDialogOpen(false)
      toast({
        title: "Item added",
        description: `Successfully added ${newItem.description}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      })
    }
  }

  const handleEditItem = async (updatedItem: RecurringTransaction | Reminder) => {
    try {
      await editItem(updatedItem)
      await fetchData()
      setIsDialogOpen(false)
      setEditingItem(null)
      toast({
        title: "Item updated",
        description: `Successfully updated ${updatedItem.description}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id)
      await fetchData()
      toast({
        title: "Item deleted",
        description: "Successfully deleted the item",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-4 sm:mt-20">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Recurring Transactions and Reminders</CardTitle>
        <CardDescription className="text-sm sm:text-base">Manage your recurring transactions and payment reminders</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "transactions" | "reminders")} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="transactions" className="flex-1 sm:flex-none">Transactions</TabsTrigger>
              <TabsTrigger value="reminders" className="flex-1 sm:flex-none">Reminders</TabsTrigger>
            </TabsList>
            <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add {activeTab === "transactions" ? "Transaction" : "Reminder"}
            </Button>
          </div>
          <TabsContent value="transactions">
            <RecurringTransactions
              transactions={transactions}
              onEdit={(item) => {
                setEditingItem(item)
                setIsDialogOpen(true)
              }}
              onDelete={handleDeleteItem}
            />
          </TabsContent>
          <TabsContent value="reminders">
            <Reminders
              reminders={reminders}
              onEdit={(item) => {
                setEditingItem(item)
                setIsDialogOpen(true)
              }}
              onDelete={handleDeleteItem}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[95vh] w-[95vw] overflow-y-auto rounded-lg sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit" : "Add"} {activeTab === "transactions" ? "Transaction" : "Reminder"}</DialogTitle>
            <DialogDescription>
              Enter the details for your {activeTab === "transactions" ? "recurring transaction" : "payment reminder"}.
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
  )
}

