// 'use client'
// import { useState } from 'react'
// import { CardContent } from '@/components/ui/card'
// import { UserAvatar } from './UserAvatar'
// import { DetailedBalanceTooltip } from './DetailedBalanceTooltip'

// interface DetailedBalance {
//   userId: string
//   name: string
//   amount: string
//   status: 'gets back' | 'owes'
// }

// interface MemberProps {
//   name: string
//   status: 'settled up' | 'gets back' | 'owes'
//   amount: number
//   amountColor: string
//   avatar: string
//   userId: string
//   detailedBalance: DetailedBalance[]
// }

// export const Member = ({ name, status, amount, amountColor, avatar, userId, detailedBalance }: MemberProps) => {
//   const [showTooltip, setShowTooltip] = useState(false)

//   return (
//     <CardContent 
//       className="relative flex w-full flex-col md:flex-row gap-3 rounded-xl border p-4 shadow dark:bg-Neutral-100 mb-2 md:mb-4"
//       onMouseEnter={() => setShowTooltip(true)}
//       onMouseLeave={() => setShowTooltip(false)}
//     >
//       <section className="flex flex-row items-center justify-between w-full gap-2">
//         <div className="flex items-center gap-3">
//           <UserAvatar user={{ userId, name, avatar }} size={40} />
//           <div className="flex flex-col">
//             <span className="text-base md:text-lg font-medium">{name}</span>
//             <span className={`text-xs md:text-sm ${status === "settled up" ? "text-gray-500" : amountColor}`}>
//               {status}
//             </span>
//           </div>
//         </div>
//         <div className={`flex items-center text-base md:text-lg font-semibold mt-2 md:mt-0 ${status === "settled up" ? "text-gray-500" : amountColor}`}>
//           {status !== "settled up" && (
//             "₹"
//           )}
//           {Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//         </div>
//       </section>
//       {showTooltip && detailedBalance.length > 0 && (
//         <DetailedBalanceTooltip detailedBalance={detailedBalance} user={{}}/>
//       )}
//     </CardContent>
//   )
// }

'use client'
import { useState } from 'react'
import { CardContent } from '@/components/ui/card'
import { UserAvatar } from './UserAvatar'
import { DetailedBalanceTooltip } from './DetailedBalanceTooltip'

interface DetailedBalance {
  userId: string
  name: string
  amount: string
  status: 'gets back' | 'owes'
  avatar: string
}

interface MemberProps {
  name: string
  status: 'settled up' | 'gets back' | 'owes'
  amount: number
  amountColor: string
  avatar: string
  userId: string
  detailedBalance: DetailedBalance[]
}

export const Member = ({ name, status, amount, amountColor, avatar, userId, detailedBalance }: MemberProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <CardContent 
      className="relative flex w-full flex-col md:flex-row gap-3 rounded-xl border p-4 shadow dark:bg-Neutral-100 mb-2 md:mb-4"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
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
          {status !== "settled up" && "₹"}
          {Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </section>
      {showTooltip && detailedBalance.length > 0 && (
        <DetailedBalanceTooltip 
          detailedBalance={detailedBalance} 
          user={{ name, status, amount ,avatar,userId  }}
        />
      )}
    </CardContent>
  )
}