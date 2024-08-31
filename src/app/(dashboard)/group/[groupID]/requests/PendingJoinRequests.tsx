"use client"

import { Button } from "@/components/ui/button"
import { acceptJoinRequest, declineJoinRequest } from "./actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type JoinRequest = {
  id: string
  userId: string
  user: {
    name: string | null
    email: string | null
  }
}

type PendingJoinRequestsProps = {
  requests: JoinRequest[]
  groupID: string
}

export function PendingJoinRequests({
  requests,
  groupID,
}: PendingJoinRequestsProps) {
  const router = useRouter()
  const handleAccept = async (requestId: string) => {
    const loadingToast = toast.loading("Accepting join request...")
    const response = await acceptJoinRequest(groupID, requestId)
    if (response.success) {
      toast.success(response.message, { id: loadingToast })
      router.refresh()
    } else {
      toast.error(response.message, { id: loadingToast })
    }
  }

  const handleDecline = async (requestId: string) => {
    const loadingToast = toast.loading("Declining join request...")
    const response = await declineJoinRequest(groupID, requestId)
    if (response.success) {
      toast.success(response.message, { id: loadingToast })
      router.refresh()
    } else {
      toast.error(response.message, { id: loadingToast })
    }
  }

  if (requests.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        No pending join requests.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex flex-col rounded-lg border p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="mb-4 sm:mb-0">
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {request.user.name || "Unnamed User"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {request.user.email}
            </p>
          </div>
          <div className="flex w-full space-x-2 sm:w-auto">
            <Button
              onClick={() => handleAccept(request.id)}
              className="w-full bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleDecline(request.id)}
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950"
            >
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
