'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';;

export const SessionProviders = async({ children }: { children: React.ReactNode }) => {
  // const session = await auth();
  return (
    // <SessionProvider session={session}>
   <SessionProvider>
      {children}
    </SessionProvider>
  );
};