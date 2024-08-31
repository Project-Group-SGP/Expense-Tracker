import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { Group, JoinRequest } from "@prisma/client"
import { Users } from "lucide-react"
import { redirect } from "next/navigation"
import { AddGroupModal } from "./_components/addGroup"
import CreatedGroupsList from "./_components/CreatedGroups"
import { JoinGroupModal } from "./_components/joinGroup"
import MemberGroupsList from "./_components/MemberGroup"
import PendingRequestsList from "./_components/PendingRequest"

export type CreatedGroup = {
  id: string
  name: string
  description: string | null
  code: string
  membersCount: number
  pendingRequestsCount: number
}

type MemberGroup = Group & {
  members: { userId: string }[]
}

type PendingRequest = JoinRequest & {
  group: Group
}

export default async function GroupManagementPage() {
  const user = await currentUserServer()

  if (!user) {
    redirect("/auth/signin")
  }

  const createdGroups = await db.group.findMany({
    where: {
      creatorId: user.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      code: true,
      _count: {
        select: {
          members: true,
          joinRequests: {
            where: { status: "PENDING" },
          },
        },
      },
    },
  })

  const createdGroupsData: CreatedGroup[] = createdGroups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    code: group.code,
    membersCount: group._count.members,
    pendingRequestsCount: group._count.joinRequests,
  }))

  const memberGroups = (await db.group.findMany({
    where: {
      members: {
        some: { userId: user.id },
      },
    },
    include: {
      members: {
        select: { userId: true },
      },
    },
  })) as MemberGroup[]

  const pendingRequests = (await db.joinRequest.findMany({
    where: {
      userId: user.id,
      status: "PENDING",
    },
    include: {
      group: true,
    },
  })) as PendingRequest[]

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
      <div className="mt-20 flex w-full flex-col gap-5 px-4">
        <div className="z-10 mb-4 flex flex-col items-start justify-between gap-4 bg-white py-4 dark:bg-zinc-950 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Groups
          </h1>
          <div className="mt-3 flex w-full flex-row gap-2 sm:mt-0 sm:w-auto">
            <AddGroupModal />
            <JoinGroupModal memberGroups={memberGroups} />
          </div>
        </div>

        {createdGroupsData.length > 0 && (
          <CreatedGroupsList groups={createdGroupsData} />
        )}

        {memberGroups.length > 0 && <MemberGroupsList groups={memberGroups} />}

        {pendingRequests.length > 0 && (
          <PendingRequestsList requests={pendingRequests} />
        )}

        {createdGroupsData.length === 0 &&
          memberGroups.length === 0 &&
          pendingRequests.length === 0 && (
            <Card className="bg-white dark:bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Users size={24} />
                  No Groups Yet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  You haven't joined any groups yet. Create a new group or join
                  an existing one to get started!
                </p>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}
