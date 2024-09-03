import { cn } from '@/lib/utils';
import { TransactionButtons } from './TransactionButtons';

type Props = {
    title : string;
    clasName?: string;
}

function PageTitle({title,clasName}: Props) {
  return (
    <div className='flex justify-between'>
      <h1 className={cn("text-2xl font-semibold",clasName)}>
          {title}
      </h1>
      <TransactionButtons/>
    </div>
  )
}

export default PageTitle