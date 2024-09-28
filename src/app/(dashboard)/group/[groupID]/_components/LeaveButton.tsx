"use client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AlertTriangle, LogOut, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { removeUserFromGroup } from "../group"

interface LeaveButtonProps {
  status: "settled up" | "gets back" | "owes"
  amount: number
  userId: string
  groupId: string
  createrId: string
}

export default function LeaveButton({
  status,
  amount,
  userId,
  groupId,
  createrId,
}: LeaveButtonProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const isCreator = userId === createrId

  const handleAction = async () => {
    if (status === "settled up" || isCreator) {
      setIsLoading(true)
      const loading = toast.loading(
        isCreator ? "Deleting group..." : "Leaving group...",
        {
          description: "Please wait while we process your request.",
        }
      )

      try {
        let result = await removeUserFromGroup(groupId, userId)

        if (result.error) {
          toast.error(
            isCreator
              ? "Failed to delete the group. Please try again."
              : "Failed to leave the group. Please try again.",
            {
              closeButton: true,
              id: loading,
            }
          )
          console.error(result.error)
        } else {
          toast.success(
            isCreator
              ? "You have successfully deleted the group."
              : "You have successfully left the group.",
            {
              closeButton: true,
              id: loading,
            }
          )
          // console.log(result.success)
          router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/group`)
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.", {
          closeButton: true,
        })
        console.error(error)
      } finally {
        setIsLoading(false)
        setIsAlertOpen(false)
      }
    }
  }

  const getAlertContent = () => {
    if (isCreator) {
      return {
        title: "Delete this group?",
        description:
          "This action cannot be undone. All group information and activities will be permanently deleted.",
        action: "Delete group",
        icon: <Trash2 className="h-6 w-6 text-red-500" />,
      }
    }

    switch (status) {
      case "settled up":
        return {
          title: "Leave group?",
          description:
            "This action cannot be undone. You will lose access to all group information and activities.",
          action: "Leave group",
          icon: <LogOut className="h-6 w-6 text-yellow-500" />,
        }
      case "gets back":
        return {
          title: "Unable to leave",
          description: `You are owed ${amount}. You need to settle up before leaving the group.`,
          action: "OK",
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        }
      case "owes":
        return {
          title: "Unable to leave",
          description: `You owe ${amount}. You need to settle up before leaving the group.`,
          action: "OK",
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        }
    }
  }

  const alertContent = getAlertContent()

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "mt-0 w-auto transition-colors duration-300",
                isCreator
                  ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  : status === "settled up"
                    ? "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                    : "border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white"
              )}
              onClick={() => setIsAlertOpen(true)}
            >
              {isCreator ? (
                <Trash2 className="mr-2 h-4 w-4" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              {isCreator ? "Delete Group" : "Leave Group"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isCreator
                ? "Delete this group"
                : status === "settled up"
                  ? "Leave this group"
                  : "Settle up before leaving"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="w-full max-w-[90vw] p-4 sm:max-w-lg sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-lg sm:text-xl">
              {alertContent.icon}
              <span className="ml-2">{alertContent.title}</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex-col gap-2 sm:mt-0 sm:flex-row sm:gap-0">
            <AlertDialogCancel
              disabled={isLoading}
              className="mb-2 w-full sm:mb-0 sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={cn(
                "w-full transition-colors duration-300 sm:w-auto",
                isCreator
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : status === "settled up"
                    ? "bg-yellow-500 text-black hover:bg-yellow-600"
                    : "cursor-not-allowed bg-gray-400 text-gray-100"
              )}
              disabled={(status !== "settled up" && !isCreator) || isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                alertContent.action
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
