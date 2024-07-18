import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "../ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Social } from "./Social";

interface CaardWrapperProps {
  children: React.ReactNode;
  headerLabel:string;
  backButtonLable: string;
  backButtonHref:string;
  showSocial?:boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLable,
  backButtonHref,
  showSocial}:CaardWrapperProps) => {


  return  <section className="flex h-screen items-center justify-center">
   <Card className="w-[400px] shadow-md">
    <CardHeader>
      <Header lable={headerLabel} />
    </CardHeader>
    <CardContent className="pb-0">
      {children}
    </CardContent>
    {showSocial && (
      <CardFooter className="flex-col pb-0">
        <Social />
      </CardFooter>
    )}
    <CardFooter className="pb-6">
      <BackButton href={backButtonHref} lable={backButtonLable}/>
    </CardFooter>
  </Card>
  </section>
}