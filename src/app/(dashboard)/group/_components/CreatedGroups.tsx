"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { CreatedGroup } from "../page"

const CreatedGroupsList = ({ groups }: { groups: CreatedGroup[] }) => {
  const copyToClipboard = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast.success("Group code copied to clipboard")
      })
      .catch(() => {
        toast.error("Failed to copy group code")
      })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
        Groups You Created
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <Link href={`/group/${group.id}`} key={group.id}>
                  <span className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    {group.name}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  title="Copy group code"
                  onClick={() => copyToClipboard(group.code)}
                >
                  <Copy className="h-5 w-5 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                {group.description || "No description available."}
              </p>
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Members: {group.membersCount}
                </span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Requests: {group.pendingRequestsCount}
                </span>
              </div>
              {group.pendingRequestsCount > 0 && (
                <Link
                  href={`/group/${group.id}/requests`}
                  className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400"
                >
                  Manage Requests
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CreatedGroupsList
