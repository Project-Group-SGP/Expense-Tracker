import { useSession } from "next-auth/react"

type User = {
  name: string
  email: string
  image: string | null
  id: string
  isTwoFactorEnable: boolean
}

/**
 * Retrieves the current user from the session.
 *
 * @return {User | undefined} The user object if available, otherwise undefined.
 */
export function useCurrentUserClient(): User | undefined {
  const session = useSession()
  return session.data?.user
}
