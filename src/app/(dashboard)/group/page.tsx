import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { Group, JoinRequest } from "@prisma/client"
import { redirect } from "next/navigation"
import GroupContent from "./GroupContent"

export type CreatedGroup = {
  id: string
  name: string
  description: string | null
  code: string
  membersCount: number
  pendingRequestsCount: number
}

export type MemberGroup = Group

export type PendingRequest = JoinRequest & {
  group: Group
}

export default async function GroupManagementPage() {
  const user = await currentUserServer()

  if (!user) {
    redirect("/auth/signin")
  }

  const [createdGroups, memberGroups, pendingRequests] = await Promise.all([
    db.group.findMany({
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
    }),
    db.group.findMany({
      where: {
        members: {
          some: { userId: user.id },
        },
      },
    }) as Promise<MemberGroup[]>,
    db.joinRequest.findMany({
      where: {
        userId: user.id,
        status: "PENDING",
      },
      include: {
        group: true,
      },
    }) as Promise<PendingRequest[]>,
  ])

  const createdGroupsData: CreatedGroup[] = createdGroups.map((group) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    code: group.code,
    membersCount: group._count.members,
    pendingRequestsCount: group._count.joinRequests,
  }))

  return (
    <GroupContent
      createdGroupsData={createdGroupsData}
      memberGroups={memberGroups}
      pendingRequests={pendingRequests}
    />
  )
}
