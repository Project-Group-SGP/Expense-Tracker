import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"


const font = Poppins({
  subsets : ['latin'],
  weight : ['600']
})


export const Header = ({lable}:{lable:string}) => (
  <div className="w-full flex flex-col gap-y-2 items-center justify-center">
    <h1 className={cn("text-3xl font-semibold", font.className)}>
     Spend Wise
    </h1>
    <p className="text-muted-foreground text-sm">
      {lable}
    </p>
  </div>
)