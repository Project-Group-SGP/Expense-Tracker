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
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <h1 className={cn("text-3xl font-bold", className)}>
        {title}
      </h1>
      <div className="flex items-center space-x-2">
        {/* {leave.status !== 'settled up' && (
          <div className={cn(
            "text-sm font-medium px-3 py-1 rounded-full",
            leave.status === 'gets back' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          )}>
            {leave.status === 'gets back' ? (
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                You get back ${leave.amount}
              </span>
            ) : (
              <span className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                You owe ${leave.amount}
              </span>
            )}
          </div>
        )} */}
        <LeaveButton
          status={leave.status}
          amount={leave.amount}
          userId={leave.userId}
          groupId={leave.groupId}
          createrId={createrId}
        />
      </div>
    </div>
  )
}