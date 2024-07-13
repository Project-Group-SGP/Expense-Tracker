import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import React, { useState, useEffect } from "react"

interface EditDescriptionModalProps {
  isOpen: boolean
  date: string
  amount: number
  description: string
  onSave: (description: string) => void
  handleCloseModal: () => void
}

export function EditDescriptionModal({
  isOpen,
  date,
  amount,
  description: initialDescription,
  handleCloseModal,
  onSave,
}: EditDescriptionModalProps) {
  const [description, setDescription] = useState(initialDescription)

  useEffect(() => {
    if (isOpen) {
      // Focus on description input when modal opens
      const descriptionInput = document.getElementById(
        "description"
      ) as HTMLInputElement
      if (descriptionInput) {
        descriptionInput.focus()
      }
    }
  }, [isOpen])

  const handleSave = () => {
    onSave(description)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>Edit Description</DialogTitle>
          <DialogDescription>
            Make changes to the description here and click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input id="date" value={date} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              value={amount}
              readOnly
              className={cn(
                "col-span-3",
                amount < 0 ? "text-red-500" : "text-green-500"
              )}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="description" className="pt-1 text-right">
              Description
            </Label>
            <Textarea
              id="description"
              autoFocus // Ensure input gets initial focus
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
