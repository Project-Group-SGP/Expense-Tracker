import { useSession } from "next-auth/react";


export function useCurrentUserClient() {
  const session = useSession();
  return session.data?.user;
}
