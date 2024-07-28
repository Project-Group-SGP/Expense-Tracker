import { auth } from "@/auth"

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
export const currentUserServer = async (): Promise<User | undefined> => {
  const session = await auth();
  return session?.user;
}
