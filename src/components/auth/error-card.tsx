"use client"
import { useSearchParams } from "next/navigation";
import { BackButton } from "./back-button";
import { Header } from "./header";
import {
Card,
CardFooter,
CardHeader,
CardContent
} from "@/components/ui/card";
import {FormError} from "./form-error"

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  const value = searchParams.get('error');
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header lable="Oops! something went wrong!"/>
      </CardHeader>
      <CardContent>
        {value==="Configuration" &&<FormError message="try login without google"/>}
      </CardContent>
      <CardFooter>
        <BackButton
          lable="Back to login"
          href="/auth/signin"
        />
      </CardFooter>
    </Card>
  )
}