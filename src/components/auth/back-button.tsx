import Link from "next/link";
import { Button } from "../ui/button";

type BackButtonProps =  {
  href:string;
  lable:string;
}

export const BackButton = ({href,lable}:BackButtonProps) => {
  return (
    <Button
      variant={"link"}
      className="font-normal w-full"
      size="sm"
      asChild
    >
      <Link href={href}>
        {lable}
      </Link>
    </Button>
  ) 
}

