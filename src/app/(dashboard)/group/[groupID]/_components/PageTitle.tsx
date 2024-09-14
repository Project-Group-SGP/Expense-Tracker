import { cn } from '@/lib/utils';
import  LeaveButton  from './LeaveButton';

type Props = {
    title : string;
    clasName?: string;
    leave: {
      status: 'settled up' | 'gets back' | 'owes';
      amount: number;
      userId: string;
      groupId: string;
    }
}

function PageTitle({title,clasName,leave}: Props) {
  return (
    <div className='flex justify-between'>
      <h1 className={cn("text-2xl font-semibold",clasName)}>
          {title}
      </h1>
      <LeaveButton amount={leave.amount} status={leave.status} userId={leave.userId} groupId={leave.groupId}/>
    </div>
  )
}

export default PageTitle