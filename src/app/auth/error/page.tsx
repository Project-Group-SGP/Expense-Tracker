import React from "react";
import { ErrorCard } from "../../../components/auth/error-card";

const AuthError = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center content-center">
      <ErrorCard/>
    </div>
  );
}

export default AuthError;