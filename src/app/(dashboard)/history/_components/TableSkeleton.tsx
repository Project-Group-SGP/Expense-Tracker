import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="w-full flex flex-row justify-around">
          <Skeleton className="ml-10 h-10 w-[255px]" />
          <Skeleton className="h-10 w-[260px]" />
          <Skeleton className="h-10 w-[215px]" />
          <Skeleton className="h-10 w-[225px]" />
          <Skeleton className="h-10 w-[145px]" />
    </div>
  );
}