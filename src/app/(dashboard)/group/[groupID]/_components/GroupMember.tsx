import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Member } from "./Member"


const GroupMember = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Member</CardTitle>
      </CardHeader>
      <CardContent>
        <Member
          name="Dhruv Kotadiya"
          status="owes"
          amount="₹66.66"
          amountColor="red"
          avatarColor="#800000" 
        />
        <Member
          name="Sarthak"
          status="gets back"
          amount="₹66.66"
          amountColor="green"
          avatarColor="#004080" 
        />
        <Member
          name="Ayush Kalathiya"
          status="settled up"
          amount=""
          amountColor="gray"
          avatarColor="#FF6347" 
        />
      </CardContent>
    </Card>
  )
}

export default GroupMember
