"use client"
import { useSearchParams } from "next/navigation"
import { CardWrapper } from "./card-wrapper"
import { BeatLoader } from "react-spinners"
import { useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/auth/new-verification"
import { FormError } from "./form-error"
import { FromSuccess } from "./form-success"


export const NewVerificationForm = () => {
  const searchparams = useSearchParams();
  const [Error ,setError] = useState<string|undefined>("");
  const [Success ,setSuccess] = useState<string|undefined>("");
  const token = searchparams.get("token");

  const onSubmit = useCallback(() => {
    if(Success || Error) return;
    if(token===null) {
      setError("Missing Token");
      return;
    }
    newVerification(token)
      .then((data)=>{
        if(data.error !== undefined)
          setError(data.error);
        else
          setSuccess(data.success);
      })
      .catch(()=>{
        setError("Something went wrong");
      });
  },[token,Success,Error]);

  useEffect(()=>{
    onSubmit();
  },[onSubmit]);

  return (
    <CardWrapper
      headerLabel="Conforming your verification"
      backButtonHref="/auth/signin"
      backButtonLable="Back to login"
    >
      <div className="flex items-center justify-center w-full h-6 mb-4 mt-2">
        {!Success && !Error && <BeatLoader />}
        {!Success && <FormError message={Error} key={Error} />}
        <FromSuccess message={Success} key={Success}/>
      </div>
    </CardWrapper>
  )
}
