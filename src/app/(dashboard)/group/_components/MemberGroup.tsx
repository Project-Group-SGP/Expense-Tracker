"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Group } from "@prisma/client"
import Link from "next/link"
import { Trash } from "lucide-react"
// Import the Trash icon from react-icons

type MemberGroupsListProps = {
  groups: Group[]
}

export default function MemberGroupsList({ groups }: MemberGroupsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Groups You're a Member Of
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="transform transition-transform hover:scale-105 hover:shadow-lg"
          >
                <Link href={`/group/${group.id}`} key={group.id}>
            <CardHeader className="bg-gradient-to-r p-4">
              <section className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">
                    {group.name}
                  </CardTitle>
                {/* <Trash
                  className="cursor-pointer transition-colors duration-200 hover:text-red-600"
                  size={20}
                  /> */}
              </section>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {group.description}
              </p>
            </CardContent>
                  </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
