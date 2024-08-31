"use client"
import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Group } from "@prisma/client"
import Link from "next/link"

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
          <Link href={`/group/${group.id}`} key={group.id}>
            <Card
              key={group.id}
              className="transform transition-transform hover:scale-105 hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-muted-foreground">
                  {group.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
