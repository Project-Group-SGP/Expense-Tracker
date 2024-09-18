import { cn } from '@/lib/utils';
import  LeaveButton  from './LeaveButton';
import { AlertTriangle, CheckCircle } from 'lucide-react';

// type Props = {
//     title : string;
//     clasName?: string;
//     leave: {
//       status: 'settled up' | 'gets back' | 'owes';
//       amount: number;
//       userId: string;
//       groupId: string;
//     }
// }

// function PageTitle({title,clasName,leave}: Props) {
//   return (
//     <div className='flex justify-between'>
//       <h1 className={cn("text-2xl font-semibold",clasName)}>
//           {title}
//       </h1>
//       <LeaveButton amount={leave.amount} status={leave.status} userId={leave.userId} groupId={leave.groupId}/>
//     </div>
//   )
// }

// export default PageTitle

interface PageTitleProps {
  title: string
  className?: string
  leave: {
    status: 'settled up' | 'gets back' | 'owes'
    amount: number
    userId: string
    groupId: string
  }
  createrId:string
}

export default function PageTitle({ title, className, leave, createrId }: PageTitleProps) {
  return (
    
<div className="flex justify-between space-y-4 flex-row items-center">
      <h1 className={cn("text-3xl font-bold", className)}>
        {title}
      </h1>
      <LeaveButton
        status={leave.status}
        amount={leave.amount}
        userId={leave.userId}
        groupId={leave.groupId}
        createrId={createrId}
      />
    </div>
  )
}