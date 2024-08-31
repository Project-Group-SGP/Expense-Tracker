"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { JoinRequest, Group } from "@prisma/client"

type PendingRequestsListProps = {
  requests: (JoinRequest & { group: Group })[]
}

export default function PendingRequestsList({
  requests,
}: PendingRequestsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Your Pending Join Requests
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {request.group.name}
                <Button
                  variant="ghost"
                  size="icon"
                  // onClick={() => onCancelRequest(request.id)}
                  title="Cancel request"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground">
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
