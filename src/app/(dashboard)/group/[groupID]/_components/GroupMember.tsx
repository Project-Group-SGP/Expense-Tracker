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
import { GroupMemberSkeleton } from "./GroupMemberSkeleton";
import {GetBalance} from "../page"

type GroupMemberProps = {
  loading:boolean,
  balance:GetBalance[]
};
export const GroupMember = ({ loading, balance }: { loading: boolean; balance: GetBalance[] }) => {
  return (
    <Card className="w-screen sm:w-auto ">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Group Members</CardTitle>
      </CardHeader>
      <CardContent>
        {!loading && balance.map((member) => (
          <Member
            key={member.userId}
            name={member.name}
            status={member.status || ""}
            amount={member.amount}
            amountColor={member.amountColor}
            avatar={member.avatar || ""}
            userId={member.userId}
          />
        ))}
        {loading && (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, index) => (
              <GroupMemberSkeleton key={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};