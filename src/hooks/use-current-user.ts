import { useSession } from "next-auth/react"

type User = {
  name: string
  email: string
  image: string | null
  id: string
  isTwoFactorEnable: boolean
  isOAuth : boolean
  joininDate :string| null;
}

/**
 * Retrieves the current user from the session.
 *
 * @return {User | undefined} The user object if available, otherwise undefined.
 */
export function useCurrentUserClient(): User | undefined {
  const session = useSession()
  //@ts-ignore
  return session.data?.user;
}
