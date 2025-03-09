import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import LeaveButton from "./LeaveButton"
import { GroupReportDialog } from "./ReportDialog"

interface PageTitleProps {
  title: string
  className?: string
  leave: {
    status: "settled up" | "gets back" | "owes"
    amount: number
    userId: string
    groupId: string
  }
  createrId: string
}

export default function PageTitle({
  title,
  className,
  leave,
  createrId,
}: PageTitleProps) {
  const params = useParams()
  const groupID = params.groupID as string

  return (
    <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
      <h1 className={cn("text-3xl font-bold", className)}>{title}</h1>
      <div className="mt-4 flex gap-2 sm:mt-0">
        <GroupReportDialog groupId={groupID} />
        <LeaveButton
          status={leave.status}
          amount={leave.amount}
          userId={leave.userId}
          createrId={createrId}
          groupId={leave.groupId}
        />
      </div>
    </div>
  )
}
