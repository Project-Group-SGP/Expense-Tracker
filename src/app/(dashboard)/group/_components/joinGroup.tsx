"use client"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
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
import { joinGroup } from "../actions"
import { useRouter } from "next/navigation"
import { MemberGroup, PendingRequest } from "../page"

const formSchema = z.object({
  code: z
    .string()
    .min(1, "Group code is required")
    .length(6, "Invalid Group Code!")
    .regex(/[A-Za-z0-9]{6}/, "Invalid Group Code!"),
})

type JoinGroupFormData = z.infer<typeof formSchema>

export function JoinGroupModal({
  memberGroups,
  onJoinRequest,
}: {
  memberGroups: MemberGroup[]
  onJoinRequest: (newRequest: PendingRequest) => void
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<JoinGroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  })

  const handleSubmit = async (data: JoinGroupFormData) => {
    const loadingToast = toast.loading("Sending join request...")

    if (memberGroups.find((group) => group.code === data.code)) {
      toast.error("You are already a member of this group", {
        id: loadingToast,
      })
      return
    }
    try {
      const result = await joinGroup(data.code)
      if (result.success) {
        toast.success(result.message, {
          closeButton: true,
          duration: 4500,
          id: loadingToast,
        })
        // Create a new PendingRequest object
        const newRequest: PendingRequest = {
          id: result.requestId!,
          userId: result.userId!,
          groupId: result.groupId!,
          status: "PENDING",
          createdAt: new Date(),
          group: {
            id: result.groupId!,
            name: result.groupName!,
            description: result.groupDescription!,
            code: result.groupCode!,
            photo: result.groupImage!,
            creatorId: result.groupCreator!,
          },
        }
        onJoinRequest(newRequest)
        handleClose()
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join group",
        { id: loadingToast }
      )
    }
  }

  const handleClose = () => {
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-1 items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 sm:flex-none"
        >
          <UserPlus size={20} />
          <span>Join Group</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">
            Join a group
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group code" {...field} />
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
                Join Group
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
