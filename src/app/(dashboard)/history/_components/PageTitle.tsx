import { cn } from '@/lib/utils';
import { TransactionButton } from './TransactionButton';

type Props = {
    title : string;
    clasName?: string;
}

function PageTitle({title,clasName}: Props) {

  return (
    <div className='flex justify-between w-full'>
      <h1 className={cn("text-2xl font-semibold",clasName)}>
          {title}
      </h1>
      <TransactionButton/>
    </div>
  )
}

export default PageTitle