// 'use client'

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Member } from "./Member"
// import { GroupMemberSkeleton } from "./GroupMemberSkeleton"

// export interface GetBalance {
//   userId: string
//   name: string
//   status: 'settled up' | 'gets back' | 'owes'
//   amount: number
//   amountColor: string
//   avatar: string
// }

// interface GroupMemberProps {
//   loading: boolean
//   balance: GetBalance[]
// }

// export const GroupMember = ({ loading, balance }: GroupMemberProps) => {
//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle className="text-xl md:text-2xl">Group Members</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {!loading && balance.map((member) => (
//           <Member
//             key={member.userId}
//             name={member.name}
//             status={member.status}
//             amount={member.amount}
//             amountColor={member.amountColor}
//             avatar={member.avatar}
//             userId={member.userId}
//           />
//         ))}
//         {loading && (
//           <div className="flex flex-col gap-4">
//             {[...Array(4)].map((_, index) => (
//               <GroupMemberSkeleton key={index} />
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Member } from "./Member"
import { GroupMemberSkeleton } from "./GroupMemberSkeleton"

export interface DetailedBalance {
  userId: string
  name: string
  amount: string
  status: 'gets back' | 'owes'
}

export interface GetBalance {
  userId: string
  name: string
  status: 'settled up' | 'gets back' | 'owes'
  amount: number
  amountColor: string
  avatar: string
  detailedBalance: DetailedBalance[]
}

interface GroupMemberProps {
  loading: boolean
  balance: GetBalance[]
}

export const GroupMember = ({ loading, balance }: GroupMemberProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Group Members</CardTitle>
      </CardHeader>
      <CardContent>
        {!loading && balance.map((member) => (
          <Member
            key={member.userId}
            name={member.name}
            status={member.status}
            amount={+member.amount}
            amountColor={member.amountColor}
            avatar={member.avatar}
            userId={member.userId}
            detailedBalance={member.detailedBalance.map((user)=>{ return {...user,avatar:balance.map((bal)=>
              user.userId===bal.userId? bal.avatar : ""  )[0]}})}
          />
        ))}
        {loading && (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, index) => (
              <GroupMemberSkeleton key={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}