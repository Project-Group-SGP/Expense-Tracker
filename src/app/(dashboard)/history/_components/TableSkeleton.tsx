import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="w-full flex flex-row justify-around">
          <Skeleton className="ml-6 h-10 w-[245px]" />
          <Skeleton className="h-10 w-[255px]" />
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[170px]" />
          <Skeleton className="h-10 w-[150px]" />
    </div>
  );
}