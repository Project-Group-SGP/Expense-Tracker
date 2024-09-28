// // Version - 1 

// // import React from 'react'
// // interface DetailedBalance {
// //   userId: string
// //   name: string
// //   amount: string
// //   status: 'gets back' | 'owes'
// // }
// // interface DetailedBalanceTooltipProps {
// //   detailedBalance: DetailedBalance[]
// // }
// // export const DetailedBalanceTooltip: React.FC<DetailedBalanceTooltipProps> = ({ detailedBalance }) => {
// //   return (
// //     <div className="absolute z-10 p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-lg top-full left-0 mt-2">
// //       <h4 className="font-bold mb-2 text-sm">Detailed Balance</h4>
// //       {detailedBalance.map((balance) => (
// //         <div key={balance.userId} className="flex justify-between mb-1 text-sm">
// //           <span className="mr-4">{balance.name}:</span>
// //           <span className={balance.status === 'gets back' ? 'text-green-500' : 'text-red-500'}>
// //             {balance.status === 'gets back' ? '+' : '-'}₹{balance.amount}
// //           </span>
// //         </div>
// //       ))}
// //     </div>
// //   )
// // }

// // Version - 2 

// // import React from 'react'
// // import { Card, CardContent, CardHeader } from "@/components/ui/card"
// // import { UserAvatar } from "./UserAvatar"
// // import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
// // import { Separator } from "@/components/ui/separator"
// // interface DetailedBalance {
// //   userId: string
// //   name: string
// //   amount: string
// //   status: 'gets back' | 'owes'
// //   avatar:string
// // }
// // interface DetailedBalanceTooltipProps {
// //   detailedBalance: DetailedBalance[]
// //   user: {
// //     name: string
// //     status: 'settled up' | 'gets back' | 'owes'
// //     amount: number
// //     userId: string
// //     avatar: string
// //   }
// // }
// // export const DetailedBalanceTooltip: React.FC<DetailedBalanceTooltipProps> = ({ detailedBalance, user }) => {
// //   const totalAmount = detailedBalance.reduce((sum, balance) => {
// //     const amount = parseFloat(balance.amount)
// //     return balance.status === 'gets back' ? sum + amount : sum - amount
// //   }, 0)
// //   return (
// //     <Card className="absolute z-10 w-80 bg-gray-900 text-white border-gray-800 top-full left-0 mt-2 shadow-lg">
// //       <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-4">
// //         <UserAvatar user={{ userId: user.userId, name: user.name, avatar: user.avatar }} size={48} />
// //         <div className="flex-1">
// //           <h3 className="text-lg font-semibold">{user.name}</h3>
// //           <p className={`text-sm ${user.status === 'gets back' ? 'text-green-400' : user.status === 'owes' ? 'text-red-400' : 'text-gray-400'}`}>
// //             {user.status}
// //           </p>
// //         </div>
// //         <div className={`text-2xl font-bold ${totalAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
// //           ₹{Math.abs(totalAmount).toFixed(2)}
// //         </div>
// //       </CardHeader>
// //       <Separator className="bg-gray-700" />
// //       <CardContent className="p-4 pt-2">
// //         <h4 className="text-sm font-medium text-gray-400 mb-2">Detailed Balance</h4>
// //         <div className="space-y-2">
// //           {detailedBalance.map((balance) => (
// //             <div key={balance.userId} className="flex items-center justify-between text-sm">
// //               <span className="font-medium truncate mr-2">{balance.name}</span>
// //               <span 
// //                 className={`flex items-center font-semibold ${
// //                   balance.status === 'gets back' ? 'text-green-400' : 'text-red-400'
// //                 }`}
// //               >
// //                 {balance.status === 'gets back' ? (
// //                   <ArrowUpIcon className="w-4 h-4 mr-1" />
// //                 ) : (
// //                   <ArrowDownIcon className="w-4 h-4 mr-1" />
// //                 )}
// //                 ₹{balance.amount}
// //               </span>
// //             </div>
// //           ))}
// //         </div>
// //       </CardContent>
// //     </Card>
// //   )
// // }

// version -3

// import React from 'react'
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { UserAvatar } from "./UserAvatar"
// import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
// import { Separator } from "@/components/ui/separator"
// interface DetailedBalance {
//   userId: string
//   name: string
//   amount: string
//   status: 'gets back' | 'owes'
//   avatar: string
// }
// interface DetailedBalanceTooltipProps {
//   detailedBalance: DetailedBalance[]
//   user: {
//     name: string
//     status: 'settled up' | 'gets back' | 'owes'
//     amount: number
//     userId: string
//     avatar: string
//   }
// }
// export const DetailedBalanceTooltip: React.FC<DetailedBalanceTooltipProps> = ({ detailedBalance, user }) => {
//   const totalAmount = detailedBalance.reduce((sum, balance) => {
//     const amount = parseFloat(balance.amount)
//     return balance.status === 'gets back' ? sum + amount : sum - amount
//   }, 0)

//   return (
//     <Card className="absolute z-10 w-full bg-background text-foreground border-border top-full left-0 mt-2 shadow-lg">
//       <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-4">
//         <UserAvatar user={{ userId: user.userId, name: user.name, avatar: user.avatar }} size={42} />
//         <div className="flex-1">
//           <h3 className="text-lg font-semibold">{user.name}</h3>
//           <p className={`text-sm ${
//             user.status === 'gets back' 
//               ? 'text-green-600 dark:text-green-400' 
//               : user.status === 'owes' 
//                 ? 'text-red-600 dark:text-red-400' 
//                 : 'text-muted-foreground'
//           }`}>
//             {user.status}
//           </p>
//         </div>
//         <div className={`text-2xl font-bold ${
//           totalAmount >= 0 
//             ? 'text-green-600 dark:text-green-400' 
//             : 'text-red-600 dark:text-red-400'
//         }`}>
//           ₹{Math.abs(totalAmount).toFixed(2)}
//         </div>
//       </CardHeader>
//       <Separator className="bg-border" />
//       <CardContent className="p-4 pt-2">
//         <h4 className="text-sm font-medium text-muted-foreground mb-2">Detailed Balance</h4>
//         <div className="space-y-3">
//           {detailedBalance.map((balance) => (
//             <div key={balance.userId} className="flex items-center justify-between text-sm">
//               <div className="flex items-center space-x-2">
//                 <UserAvatar user={{ userId: balance.userId, name: balance.name, avatar: balance.avatar }} size={32} />
//                 <span className="font-medium truncate">{balance.name}</span>
//               </div>
//               <span 
//                 className={`flex items-center font-semibold ${
//                   balance.status === 'gets back' 
//                     ? 'text-green-600 dark:text-green-400' 
//                     : 'text-red-600 dark:text-red-400'
//                 }`}
//               >
//                 {balance.status === 'gets back' ? (
//                   <ArrowUpIcon className="w-4 h-4 mr-1" />
//                 ) : (
//                   <ArrowDownIcon className="w-4 h-4 mr-1" />
//                 )}
//                 ₹{balance.amount}
//               </span>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserAvatar } from "./UserAvatar"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DetailedBalance {
  userId: string
  name: string
  amount: string
  status: 'gets back' | 'owes'
  avatar: string
}

interface DetailedBalanceTooltipProps {
  detailedBalance: DetailedBalance[]
  user: {
    name: string
    status: 'settled up' | 'gets back' | 'owes'
    amount: number
    userId: string
    avatar: string
  }
}

export const DetailedBalanceTooltip: React.FC<DetailedBalanceTooltipProps> = ({ detailedBalance, user }) => {
  const totalAmount = detailedBalance.reduce((sum, balance) => {
    const amount = parseFloat(balance.amount)
    return balance.status === 'gets back' ? sum + amount : sum - amount
  }, 0)

  return (
    <Card className="absolute z-10 w-full max-w-[90vw] sm:max-w-[400px] bg-background text-foreground border-border top-full left-0 mt-2 shadow-lg">
      <CardHeader className="p-3 sm:p-4 pb-2 flex flex-row items-center space-x-2 sm:space-x-4">
        <UserAvatar user={{ userId: user.userId, name: user.name, avatar: user.avatar }} size={36} />
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold truncate">{user.name}</h3>
          <p className={`text-xs sm:text-sm truncate ${
            user.status === 'gets back' 
              ? 'text-green-600 dark:text-green-400' 
              : user.status === 'owes' 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-muted-foreground'
          }`}>
            {user.status}
          </p>
        </div>
        <div className={`text-lg sm:text-2xl font-bold ${
          totalAmount >= 0 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          ₹{Math.abs(totalAmount).toFixed(2)}
        </div>
      </CardHeader>
      <Separator className="bg-border" />
      <CardContent className="p-3 sm:p-4 pt-2">
        <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Detailed Balance</h4>
        <ScrollArea>
          <div className="space-y-2 sm:space-y-3 pr-4">
            {detailedBalance.map((balance) => (
              <div key={balance.userId} className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <UserAvatar user={{ userId: balance.userId, name: balance.name, avatar: balance.avatar }} size={24} />
                  <span className="font-medium truncate">{balance.name}</span>
                </div>
                <span 
                  className={`flex items-center font-semibold whitespace-nowrap ${
                    balance.status === 'gets back' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {balance.status === 'gets back' ? (
                    <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  )}
                  ₹{balance.amount}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}