import { cn } from '@/lib/utils';

type Props = {
    title : string;
    clasName?: string;
}

function PageTitle({title,clasName}: Props) {
  return (
    <h1 className={cn("text-2xl font-semibold",clasName)}>
        {title}
    </h1>
  )
}

export default PageTitle