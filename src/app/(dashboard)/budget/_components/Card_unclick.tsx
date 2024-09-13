
import { CardContent } from '@/components/ui/card';
// import { CurrencyDollar } from 'lucide-react';

import React from 'react';
import AnimatedCounter from '../../dashboard/_components/AnimatedCounter';
import { cn } from '@/lib/utils';
import { IndianRupee, LucideIcon, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


type CateroyCardType = {
  title: string;
  amount: number;
  color: string;
  icon: LucideIcon;
};

const Card_unclick = (prop: CateroyCardType) => {
  
 
  


  return (<>
        <CardContent className="flex w-full flex-col gap-3 rounded-xl  border p-5 shadow dark:bg-black">
        <section className="flex justify-between gap-2">
            {/* Label */}
            <p className={cn('text-sm font-semibold', prop.color)}>{prop.title}</p>
            {/* Icon */}
            <prop.icon className={cn("h-4 text-3xl w-4 text-gray-900 ", prop.color)} />
        </section>

        <section className="flex flex-col gap-1">
            {/* Amount */}
            <h2 className= {cn("flex items-center gap-1 text-2xl font-semibold",prop.color)}>
            <IndianRupee className="text-2xl" />
            <AnimatedCounter amount={prop.amount} />
            </h2>
        </section>

        </CardContent>
    </>);
};

export default Card_unclick;