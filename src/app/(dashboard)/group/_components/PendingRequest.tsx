import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { JoinRequest, Group } from "@prisma/client"
import { cancelPendingRequest } from "../actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type PendingRequest = JoinRequest & { group: Group }

type PendingRequestsListProps = {
  requests: PendingRequest[]
  onRequestCancel: (id: string) => void
}

export default function PendingRequestsList({
  requests,
  onRequestCancel,
}: PendingRequestsListProps) {
  const router = useRouter()

  async function cancelRequest(id: string) {
    const loadingToast = toast.loading("Cancelling request...")
    try {
      const response = await cancelPendingRequest(id)
      if (response.success) {
        toast.success(response.message, { id: loadingToast })
        onRequestCancel(id)
      } else {
        toast.error(response.message, { id: loadingToast })
      }
    } catch (error) {
      toast.error("Failed to cancel request", {
        id: loadingToast,
      })
    }
  }

  if (requests.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Your Pending Join Requests
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <Card
            key={request.id}
            className="transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {request.group.name}
                <Button
                  variant="ghost"
                  size="icon"
                  title="Cancel request"
                  onClick={() => cancelRequest(request.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-gray-600 text-muted-foreground dark:text-gray-400">
                {request.group.description}
              </p>
              <div className="text-sm">
                <span className="font-medium">Status: Pending</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
