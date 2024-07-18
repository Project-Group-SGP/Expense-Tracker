import { CheckCircledIcon
} from "@radix-ui/react-icons";

interface FromSuccessProps {
 message?: string;
}

export const FromSuccess = ({message}:FromSuccessProps) =>{
 if(message=="") return <></>

 return (
   <div className="bg-emerald-100 p-3 rounded-md items-center flex gap-x-2 text-sm text-emerald-500">
     <CheckCircledIcon className="h-4 w-4"/>
     <p>{message}</p>
   </div>
 )
} 