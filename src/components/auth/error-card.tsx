import { BackButton } from "./back-button";
import { Header } from "./header";
import {
Card,
CardFooter,
CardHeader
} from "@/components/ui/card";
Header

export const ErrorCard = () => {
  
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header lable="Oops! something went wrong!"/>
      </CardHeader>
      <CardFooter>
        <BackButton
          lable="Back to login"
          href="/auth/signin"
        />
      </CardFooter>
    </Card>
  )
}