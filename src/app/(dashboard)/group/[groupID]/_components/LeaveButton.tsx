'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { LogOut } from 'lucide-react'
import { removeUserFromGroup } from '../group'
import { toast } from 'sonner'

interface Props {
  status: 'settled up' | 'gets back' | 'owes';
  amount: number;
  userId: string;
  groupId: string;
}

export default function LeaveButton({ status, amount, userId, groupId }: Props) {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLeave = async () => {
    if (status === 'settled up') {
      setIsLoading(true)
      // toast({
      //   title: 'Leaving group...',
      //   description: 'Please wait while we process your request.',
      // })
      const loading=toast.loading("Leaving group...",{
        description:'Please wait while we process your request.'
      });

      try {
        const result = await removeUserFromGroup(groupId, userId)
        if (result.error) {
          toast.error("Failed to leave the group. Please try again.",{
            closeButton:true,
            id:loading
          });
          console.error(result.error)
        } else {
          toast.success("You have successfully left the group.",{
            closeButton:true,
            id:loading
          })
          console.log(result.success)
          router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/group`)
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.",{
          closeButton:true,
        });
        console.error(error)
      } finally {
        setIsLoading(false)
        setIsAlertOpen(false)
      }
    }
  }

  const getAlertContent = () => {
    switch (status) {
      case 'settled up':
        return {
          title: 'Are you sure you want to leave?',
          description: 'This action cannot be undone. You will lose access to all group information and activities.',
          action: 'Yes, leave group'
        }
      case 'gets back':
        return {
          title: 'Unable to leave group',
          description: `You are owed $${amount}. You need to settle up before leaving the group.`,
          action: 'OK'
        }
      case 'owes':
        return {
          title: 'Unable to leave group',
          description: `You owe $${amount}. You need to settle up before leaving the group.`,
          action: 'OK'
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
              className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors duration-300"
              onClick={() => setIsAlertOpen(true)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Leave Group
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Leave this group</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeave}
              className={status === 'settled up' ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-gray-400 text-gray-100 cursor-not-allowed"}
              disabled={status !== 'settled up' || isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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