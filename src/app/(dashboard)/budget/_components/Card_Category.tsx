import React from "react";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IndianRupee, LucideIcon } from "lucide-react";
import AnimatedCounter from "../../dashboard/_components/AnimatedCounter";

type CateroyCardType = {
  title: string;
  amount: number;
  color: string;
  icon: LucideIcon;
  
};

const Card_Category = (prop: CateroyCardType) => {
  return (
    <CardContent className="flex w-full flex-col gap-3 rounded-xl cursor-pointer border p-5 shadow dark:bg-black">
      <section className="flex justify-between gap-2">
        <div className={cn("text-sm font-semibold", prop.color)}>{prop.title}</div>
        <prop.icon className={cn("h-4 w-4 text-gray-900", prop.color)} />
      </section>
      <section className="flex flex-col gap-1">
        <h2 className={cn("flex items-center gap-1 text-2xl font-semibold", prop.color)}>
          <IndianRupee className="text-2xl" />
          <AnimatedCounter amount={prop.amount} />
        </h2>
      </section>
    </CardContent>
  );
};

export default Card_Category;
