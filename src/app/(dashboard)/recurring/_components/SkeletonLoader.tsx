import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

export function SkeletonLoader() {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4 max-w-[200px]" />
        <Skeleton className="h-4 w-1/2 max-w-[150px]" />
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
        <div className="space-y-4 overflow-x-auto">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 py-3 border-b min-w-[600px]">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 py-4 min-w-[600px]">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full hidden sm:block" />
              <Skeleton className="h-5 w-full hidden sm:block" />
              <Skeleton className="h-6 w-12 rounded-full hidden md:block" />
              <div className="justify-center space-x-2 hidden md:flex">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between p-4 gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  )
}

