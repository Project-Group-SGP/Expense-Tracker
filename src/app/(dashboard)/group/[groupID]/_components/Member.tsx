"use client"

import { useState } from "react"
import { CardContent } from "@/components/ui/card"
import { UserAvatar } from "./UserAvatar"
import { DetailedBalanceTooltip } from "./DetailedBalanceTooltip"

interface DetailedBalance {
  userId: string
  name: string
  amount: string
  status: "gets back" | "owes"
  avatar: string
}

interface MemberProps {
  name: string
  status: "settled up" | "gets back" | "owes"
  amount: number
  amountColor: string
  avatar: string
  userId: string
  detailedBalance: DetailedBalance[]
}

export const Member = ({
  name,
  status,
  amount,
  amountColor,
  avatar,
  userId,
  detailedBalance,
}: MemberProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <CardContent
      className={"dark:bg-Neutral-100 mb-2 relative flex w-full flex-col gap-3 rounded-xl border p-4 shadow md:flex-row md:mb-4"}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <section className="flex w-full flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <UserAvatar user={{ userId, name, avatar }} size={40} />
          <div className="flex flex-col">
            <span className="text-base font-medium md:text-lg">{name}</span>
            <span
              className={`text-xs md:text-sm ${status === "settled up" ? "text-gray-500" : amountColor}`}
            >
              {status === "settled up"
                ? "All settled"
                : status === "gets back"
                  ? "Recieves"
                  : "Has to pay"}
            </span>
          </div>
        </div>
        <div
          className={`mt-2 flex items-center text-base font-semibold md:mt-0 md:text-lg ${status === "settled up" ? "text-gray-500" : amountColor}`}
        >
          {status !== "settled up" && "₹"}
          {Number(amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </section>
      {showTooltip && detailedBalance.length > 0 && (
        <DetailedBalanceTooltip
          detailedBalance={detailedBalance}
          user={{ name, status, amount, avatar, userId }}
        />
      )}
    </CardContent>
  )
}