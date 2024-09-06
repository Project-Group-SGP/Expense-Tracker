// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Member } from "./Member";

// type GroupMemberProps = {
//   groupMemberName: {
//     userId: string;
//     name: string;
//     avatar?: string;
//   }[];
// };

// const GroupMember = ({ groupMemberName }: GroupMemberProps) => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Group Member</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {groupMemberName.map((member, index) => (
//           <Member
//             key={member.userId}
//             name={member.name}
//             status={index === 0 ? "owes" : "gets back"} // Example logic
//             amount="₹66.66"  // Example amount, you can modify it as needed
//             amountColor={index === 0 ? "red" : "green"} // Example colors
            
//           />
//         ))}
//       </CardContent>
//     </Card>
//   );
// };

// export default GroupMember;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Member } from "./Member";

type GroupMemberProps = {
  groupMemberName: {
    userId: string;
    name: string;
    avatar: string;
  }[];
};

export const GroupMember = ({ groupMemberName }: GroupMemberProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Group Member</CardTitle>
      </CardHeader>
      <CardContent>
        {groupMemberName.map((member, index) => (
          <Member
            key={member.userId}
            name={member.name}
            status={index === 0 ? "owes" : "gets back"} // Example logic
            amount="₹66.66"  // Example amount
            amountColor={index === 0 ? "red" : "green"} // Example colors
            avatar={member.avatar}  // Pass avatar to Member component
            userId={member.userId}  // Pass userId for avatar generation fallback
          />
        ))}
      </CardContent>
    </Card>
 
      );
};