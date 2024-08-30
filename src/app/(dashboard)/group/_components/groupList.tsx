import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Group } from "@prisma/client"

type GroupListProps = {
  groups: Group[]
}

export default function GroupList({ groups }: GroupListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Card key={group.id}>
          <CardHeader>
            <CardTitle>{group.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
