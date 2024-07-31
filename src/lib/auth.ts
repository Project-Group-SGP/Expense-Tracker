import { auth } from "@/auth"

type User = {
  name: string
  email: string
  image: string | null
  id: string
  isTwoFactorEnable: boolean
  isOAuth:boolean
}

/**
 * Retrieves the current user from the session.
 *
 * @return {User | undefined} The user object if available, otherwise undefined.
 */
export const currentUserServer = async (): Promise<User | undefined> => {
<<<<<<< HEAD
  const session = await auth()
  return session?.user
=======
  const session = await auth();
   //@ts-ignore
  return session?.user;
>>>>>>> 76d1c281e1844fbdcad32beb58e06bc5579f038e
}
