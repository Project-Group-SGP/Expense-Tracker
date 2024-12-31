// page.tsx (Server Component)
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import GroupClientComponent from "./_components/GroupClientComponet"
import {
  fetchGroupBalances,
  getAllData,
  getGroupTransactionData,
} from "./group"

export default async function GroupPage({
  params,
}: {
  params: { groupID: string }
}) {
  const user = await currentUserServer()
  const headersList = headers()
  const cookie = headersList.get("cookie") || ""

  if (!user) {
    redirect("/auth/signin")
  }

  const group = await db.group.findUnique({
    where: { id: params.groupID, members: { some: { userId: user.id } } },
  })

  if (!group) {
    redirect("/404")
  }

  const [transactionData, data, balance] = await Promise.all([
    getGroupTransactionData(params.groupID, cookie),
    getAllData(params.groupID, cookie),
    fetchGroupBalances(params.groupID, cookie),
  ])

  const groupMembers = balance.map((b) => ({
    userId: b.userId,
    avatar: b.avatar,
    name: b.name,
  }))

  const findcurrentuser = balance.find((b) => b.userId === user.id) || null

  const leave = {
    status: findcurrentuser?.status ?? "gets back",
    amount: findcurrentuser?.amount ?? 0,
    userId: findcurrentuser?.userId ?? "",
    groupId: params.groupID,
  }

  return (
    <GroupClientComponent
      groupName={group.name}
      creatorId={group.creatorId}
      userName={user?.name.split(" ")[0]}
      userId={user.id}
      leave={leave}
      groupMembers={groupMembers}
      settleup={data}
      transactionData={transactionData}
      balance={balance}
    />
  )
}
