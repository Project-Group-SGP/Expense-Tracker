import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import PageTitle from "../../dashboard/_components/PageTitle"

import { Cardcontent } from "../../dashboard/_components/Card"
import { AddExpense } from "./_components/AddExpense"
import GroupMember from "./_components/GroupMember"
import { SettleUp } from "./_components/SettleUp"
import Transaction from "./_components/Transaction"

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
    where: { id: params.groupID, members: { some: { userId: user.id } } },
  });
  // console.log("Group Details : ");
  // console.log(group);

  if (!group) {
    redirect("/404")
  }
  return (
    <Suspense>
      <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mt-20 flex w-full flex-col gap-5 px-4">
          <PageTitle title={group.name} />

          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <p className="mr-auto">
              Welcome Back,
              <span className="text font-semibold text-orange-500 dark:text-sky-500">
                {" "}
                {user?.name.split(" ")[0]}{" "}
              </span>
              👋
            </p>
            <div className="ml-auto flex gap-2">
              <AddExpense />
              <SettleUp />
            </div>
          </div>

          <section className="text-bl grid w-full gap-4 transition-all sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
            {/* Set budget for a particular category */}
            <Cardcontent className="border-none p-0 md:col-span-2 lg:col-span-2">
              {/* Group transaction */}
              <Transaction />
            </Cardcontent>
            <Cardcontent className="border-none p-0">
              {/* Group member balance */}
              <GroupMember />
            </Cardcontent>
          </section>
        </div>
      </div>
    </Suspense>
  )
}
