import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Users } from "lucide-react"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import GroupList from "./_components/groupList"
import { AddGroupModal } from "./_components/addGroup"

export default async function GroupManagementPage() {
  const user = await currentUserServer()
  if (!user) {
    redirect("/auth/signin")
  }

  const userGroups = await db.groupMember.findMany({
    where: { userId: user.id },
    include: { group: true },
  })

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
      <div className="mt-20 flex w-full flex-col gap-5 px-4">
        <div className="z-10 mb-4 flex flex-col items-start justify-between gap-4 bg-white py-4 dark:bg-zinc-950 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Groups
          </h1>
          <div className="mt-3 flex w-full flex-row gap-2 sm:mt-0 sm:w-auto">
            <AddGroupModal />
            <Button
              variant="outline"
              className="flex flex-1 items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 sm:flex-none"
            >
              <UserPlus size={20} />
              <span>Join Group</span>
            </Button>
          </div>
        </div>

        {userGroups.length > 0 ? (
          <GroupList groups={userGroups.map((member) => member.group)} />
        ) : (
          <Card className="bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Users size={24} />
                No Groups Yet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                You haven't joined any groups yet. Create a new group or join an
                existing one to get started!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
