"use client"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Copy, PlusCircle } from "lucide-react"
import { AddnewGroup } from "../actions"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().max(50, "Group description is too long").default(""),
})

export type GroupFormData = z.infer<typeof formSchema>

export function AddGroupModal() {
  const [open, setOpen] = useState(false)
  const [groupCode, setGroupCode] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<GroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const handleSubmit = async (data: GroupFormData) => {
    const loadingToast = toast.loading("Creating group...")
    try {
      const result = await AddnewGroup({ data })
      if (result.success && result.code) {
        setGroupCode(result.code)
        toast.success("Group created successfully", {
          closeButton: true,
          id: loadingToast,
        })
      } else {
        throw new Error(result.error || "Failed to create group")
      }
    } catch (error) {
      console.error("Error creating group:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to create group",
        { id: loadingToast }
      )
    }
  }

  const copyCodeToClipboard = () => {
    if (groupCode) {
      navigator.clipboard.writeText(groupCode)
      toast.success("Group code copied to clipboard")
    }
  }

  const handleClose = () => {
    if (groupCode) {
      router.refresh()
    }
    setOpen(false)
    setGroupCode(null)
    form.reset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose()
        } else {
          setOpen(true)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 sm:flex-none">
          <PlusCircle size={20} />
          <span>Create Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            Create a new group
          </DialogTitle>
        </DialogHeader>

        {!groupCode ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="mt-4 space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter group name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter group description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6 sm:mt-8">
                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary/90 sm:w-auto"
                >
                  Create Group
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="mt-4 space-y-4">
            <p>
              Your group has been created successfully! Share this code with
              others to join:
            </p>
            <div className="flex items-center justify-between rounded-md border p-2">
              <span className="text-lg font-semibold">{groupCode}</span>
              <Button variant="ghost" size="icon" onClick={copyCodeToClipboard}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleClose}
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
