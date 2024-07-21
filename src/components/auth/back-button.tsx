import Link from "next/link"
import { Button } from "../ui/button"

interface BackButtonProps {
  href: string
  lable: string
}

export const BackButton = ({ href, lable }: BackButtonProps) => {
  return (
    <Button variant={"link"} className="w-full font-normal" size="sm" asChild>
      <Link href={href}>{lable}</Link>
    </Button>
  )
}
