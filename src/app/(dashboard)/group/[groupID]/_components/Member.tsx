'use client'

import { CardContent } from '@/components/ui/card'
import { IndianRupee } from 'lucide-react'
import { UserAvatar } from './UserAvatar'

interface MemberProps {
  name: string
  status: 'settled up' | 'gets back' | 'owes'
  amount: number
  amountColor: string
  avatar: string
  userId: string
}

export const Member = ({ name, status, amount, amountColor, avatar, userId }: MemberProps) => {
  return (
    <CardContent className="flex w-full flex-col md:flex-row gap-3 rounded-xl border p-4 shadow dark:bg-Neutral-100 mb-2 md:mb-4">
      <section className="flex flex-row items-center justify-between w-full gap-2">
        <div className="flex items-center gap-3">
          <UserAvatar user={{ userId, name, avatar }} size={40} />
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-medium">{name}</span>
            <span className={`text-xs md:text-sm ${status === "settled up" ? "text-gray-500" : amountColor}`}>
              {status}
            </span>
          </div>
        </div>
        <div className={`flex items-center text-base md:text-lg font-semibold mt-2 md:mt-0 ${status === "settled up" ? "text-gray-500" : amountColor}`}>
          {status !== "settled up" && (
            "₹"
          )}
          {Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </section>
    </CardContent>
  )
}