import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import React, { useEffect, useRef } from "react"

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
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const handleSave = () => {
    if (descriptionRef.current) {
      onSave(descriptionRef.current.value)
    }
    handleCloseModal()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="w-96 z-[6000]">
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
            <Input
              id="date"
              value={date}
              className="col-span-3"
              readOnly
              tabIndex={-1}
            />
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
              tabIndex={-1}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="description" className="pt-1 text-right">
              Description
            </Label>
            <Textarea
              id="description"
              ref={descriptionRef}
              defaultValue={initialDescription}
              className="col-span-3 resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-1">
          <Button
            type="submit"
            variant={"default"}
            className="w-full rounded-md text-white"
            onClick={handleSave}
          >
            Save changes
          </Button>
          <DialogClose asChild>
            <Button
              onClick={handleCloseModal}
              variant={"destructive"}
              className="w-full rounded-md text-white"
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
