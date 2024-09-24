import React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { BackButton } from "./back-button"
import { Header } from "./header"
import { Social } from "./Social"

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLable: string
  backButtonHref: string
  showSocial?: boolean
  disabled?:boolean
  setDisabled?:any
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLable,
  backButtonHref,
  showSocial,
  disabled,
  setDisabled
}: CardWrapperProps) => {
  return (
    <section className="flex h-screen items-center justify-center my-8 mx-4">
      <Card className="w-[400px] shadow-md">
        <CardHeader>
          <Header lable={headerLabel} />
        </CardHeader>
        <CardContent className="pb-0">{children}</CardContent>
        {showSocial && (
          <CardFooter className="flex-col pb-0">
            <Social disabled={disabled || false} setDisabled={setDisabled} />
          </CardFooter>
        )}
        <CardFooter className="pb-6">
          <BackButton href={backButtonHref} lable={backButtonLable}  />
        </CardFooter>
      </Card>
    </section>
  )
}
