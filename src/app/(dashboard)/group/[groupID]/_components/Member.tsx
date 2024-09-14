import AnimatedCounter from '@/app/(dashboard)/dashboard/_components/AnimatedCounter'
import { CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { IndianRupee, LucideIcon } from 'lucide-react'
import React from 'react'
import { UserAvatar } from './UserAvatar'



interface MemberProps {
  name: string;
  status:  'settled up' | 'gets back' | 'owes';
  amount: number;
  amountColor: string;
  avatar: string;
  userId: string;
}

export const Member = ({ name,
  status,
  amount,
  amountColor,
  avatar,
  userId, }: MemberProps) => {
    console.log(amount)
  return (
    <CardContent className="flex w-full m-2 flex-col gap-3 rounded-xl border p-5 shadow dark:bg-Neutral-100">
      <section className="flex justify-between gap-2">
        {/* Avatar and Name Section */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {/* <UserAvatar  */}
          <UserAvatar user={{ userId, name, avatar }} size={40} />
          
          {/* Name and Status */}
          <div className="flex flex-col">
            <span className="text-lg font-medium">{name}</span>
            <span className={`text-sm ${status==="settled up"? "text-gray-500" :amountColor}`}>{status}</span>
          </div>
        </div>
        {/* Amount Section */}
        <div className={`flex items-center text-lg font-semibold ${status==="settled up"? "text-gray-500" :amountColor}`}>
          {status !== "settled up" && (
            <IndianRupee className="mr-1 text-xl" />
          )}
          {amount}
        </div>
      </section>
    </CardContent>
  );
};



