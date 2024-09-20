import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { acceptJoinRequest, declineJoinRequest } from "./actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FaUser } from "react-icons/fa"

type JoinRequest = {
  id: string
  userId: string
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
}

type PendingJoinRequestsProps = {
  requests: JoinRequest[]
  groupID: string
}

export function PendingJoinRequests({
  requests: initialRequests,
  groupID,
}: PendingJoinRequestsProps) {
  const router = useRouter()
  const [requests, setRequests] = useState(initialRequests)
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set())

  const handleAccept = async (requestId: string) => {
    // Optimistic update
    setRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== requestId)
    )
    setPendingActions((prev) => new Set(prev).add(requestId))

    try {
      const response = await acceptJoinRequest(groupID, requestId)
      if (response.success) {
        toast.success(response.message)
      } else {
        // Revert optimistic update on failure
        setRequests(initialRequests)
        toast.error(response.message)
      }
    } catch (error) {
      // Revert optimistic update on error
      setRequests(initialRequests)
      toast.error("An error occurred while accepting the request")
    } finally {
      setPendingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
    }
  }

  const handleDecline = async (requestId: string) => {
    // Optimistic update
    setRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== requestId)
    )
    setPendingActions((prev) => new Set(prev).add(requestId))

    try {
      const response = await declineJoinRequest(groupID, requestId)
      if (response.success) {
        toast.success(response.message)
      } else {
        // Revert optimistic update on failure
        setRequests(initialRequests)
        toast.error(response.message)
      }
    } catch (error) {
      // Revert optimistic update on error
      setRequests(initialRequests)
      toast.error("An error occurred while declining the request")
    } finally {
      setPendingActions((prev) => {
        const newSet = new Set(prev)
        newSet.delete(requestId)
        return newSet
      })
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
          <div className="mb-4 flex items-center sm:mb-0">
            <Avatar className="mr-4 h-10 w-10">
              <AvatarImage
                src={request.user.image || ""}
                alt={request.user.name || "User"}
              />
              <AvatarFallback>
                <FaUser className="text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {request.user.name || "Unnamed User"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {request.user.email}
              </p>
            </div>
          </div>
          <div className="flex w-full space-x-2 sm:w-auto">
            <Button
              onClick={() => handleAccept(request.id)}
              className="w-full bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              disabled={pendingActions.has(request.id)}
            >
              {pendingActions.has(request.id) ? "Processing..." : "Accept"}
            </Button>
            <Button
              onClick={() => handleDecline(request.id)}
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950"
              disabled={pendingActions.has(request.id)}
            >
              {pendingActions.has(request.id) ? "Processing..." : "Decline"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
