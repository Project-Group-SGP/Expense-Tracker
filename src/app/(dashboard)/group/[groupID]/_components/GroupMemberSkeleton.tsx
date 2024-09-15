import { CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const GroupMemberSkeleton = () => {
  return (
    <CardContent className="flex w-full m-1 gap-3 rounded-xl justify-between border p-5 shadow dark:bg-Neutral-100">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
        <Skeleton className="h-12 w-20 rounded-sm" />
    </CardContent>
  )
}