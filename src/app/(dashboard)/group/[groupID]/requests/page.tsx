import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { PendingJoinRequests } from "./PendingJoinRequests"
import { currentUserServer } from "@/lib/auth"

export default async function GroupPage({
  params,
}: {
  params: { groupID: string }
}) {
  const user = await currentUserServer()
  if (!user) {
    redirect("/auth/signin")
  }

  const group = await db.group.findUnique({
    where: { id: params.groupID },
    include: {
      joinRequests: {
        where: { status: "PENDING" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  })
  if (!group) {
    redirect("/404")
  }

  if (user.id !== group.creatorId) {
    redirect("/404")
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col p-4">
      <div className="mt-20 flex w-full flex-col gap-5">
        <div className="z-10 mb-4 flex flex-col items-start justify-between gap-4 bg-white py-4 dark:bg-zinc-950 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
            Group Requests
          </h1>
        </div>
        <PendingJoinRequests
          requests={group.joinRequests}
          groupID={params.groupID}
        />
      </div>
    </div>
  )
}
