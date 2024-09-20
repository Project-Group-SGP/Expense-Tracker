import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
})

export const Header = ({ lable }: { lable: string }) => (
  <div className="flex w-full flex-col items-center justify-center gap-y-2">
    <h1 className={cn("text-3xl font-semibold", font.className)}>
      spend<span className="text-green-500">wise</span>
    </h1>
    <p className="text-sm text-muted-foreground">{lable}</p>
  </div>
)
