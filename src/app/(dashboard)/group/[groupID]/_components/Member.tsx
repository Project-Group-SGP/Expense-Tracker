import AnimatedCounter from '@/app/(dashboard)/dashboard/_components/AnimatedCounter'
import { CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { IndianRupee, LucideIcon } from 'lucide-react'
import React from 'react'

type CateroyCardType = {

};


export const Member = ({ name, status, amount, amountColor, avatarColor }) => {
  return (
    <CardContent className="flex w-full m-2 flex-col gap-3 rounded-xl border p-5 shadow dark:bg-Neutral-100">
      <section className="flex justify-between gap-2">
        {/* Avatar and Name Section */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full"
            style={{ backgroundColor: avatarColor }}
          ></div>
          {/* Name and Status */}
          <div className="flex flex-col">
            <span className="text-lg font-medium">{name}</span>
            <span className="text-sm text-gray-500">{status}</span>
          </div>
        </div>
        {/* Amount Section */}
        <div className="flex items-center text-lg font-semibold" style={{ color: amountColor }}>
          {status !== "settled up" && (
            <IndianRupee className="mr-1 text-xl" />
          )}
          {amount}
        </div>
      </section>
    </CardContent>
  );
};


