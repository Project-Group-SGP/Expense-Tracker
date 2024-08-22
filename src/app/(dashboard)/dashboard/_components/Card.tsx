
import { cn } from "@/lib/utils"
import { IndianRupee, LucideIcon } from "lucide-react"
import React from "react"
import AnimatedCounter from "./AnimatedCounter"


type CardProps = {
  label: string
  icon: LucideIcon
  amount: string ;
  description: string
  iconclassName?: string
  descriptionColor?:string
}

export default function Card(props: CardProps) {
  return (
    <Cardcontent>
      <section className={cn("flex justify-between gap-2",props.iconclassName)}>
        {/* lable */}
        <p className="text-sm font-semibold">{props.label}</p>
        {/* icon */}
        <props.icon className={cn("h-5 text-3xl w-5 text-gray-900 ",props.iconclassName)} />
      </section>
      <section className="flex flex-col gap-1">
        {/* amount */}
        <h2 className={cn("flex items-center gap-1 text-2xl font-semibold",props.iconclassName)}>
          <IndianRupee className="text-2xl" />
          <AnimatedCounter amount={Number(props.amount)} />
         
        </h2>
        <p className={cn("text-xs text-gray-500",props.descriptionColor)}>{props.description}</p>
      </section>
    </Cardcontent>
  )
}

export function Cardcontent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border p-5 shadow dark:bg-black",
        props.className
      )}
    />
  )
}
