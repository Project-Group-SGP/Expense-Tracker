import {currentUserServer} from "@/lib/auth";
import {db} from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {

    // check if user is logged in
    const user = await currentUserServer();
    if (!user) {    
        return new NextResponse("Unauthorized", { status: 401 });
    }

    // check if group id is provided
    const groupID = req.nextUrl.searchParams.get("groupID");
    if (!groupID) {
        return new NextResponse("Group ID is required", { status: 400 });   
    }

    // check if group exists
    const group = await db.group.findUnique({
        where: { id: groupID },
    });

    if (!group) {
        return new NextResponse("Group not found", { status: 404 });
    }

    // get group members
    const groupMembers = await db.groupMember.findMany({
        where: { groupId: group.id },
        include: {
            user: {
                select: { id: true, name: true, image: true },
            },
        },
    });
    // chek if current user is in group

    const groupMember = groupMembers.find((member) => member.userId === user.id);

    if (!groupMembers) {
        return new NextResponse("Group members not found", { status: 404 });
    }

    
    // get group transactions
    const groupTransations = await db.groupExpense.findMany({
        where: { groupId: group.id },
        include: {
          paidBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          splits: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              payments: true,
            },
          },
          group: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
      
     
      // format data According to required 
      const formattedData = groupTransations.map(expense => ({
        groupId: expense.groupId,
        expenseId: expense.id,
        amount: expense.amount,
        category: expense.category,
        paidById: expense.paidById,
        description: expense.description,
        date: expense.date,
        expenseSplits: expense.splits.map(split => ({
          userId: split.userId,
          expenseId: split.expenseId,
          amount: split.amount,
          isPaid: split.isPaid,
        })),
      }));
      


    //   console.log("formattedData: ", formattedData[0]);
    //   console.log("groupTransactions: ", JSON.stringify(groupTransations, null, 2));
    
    
    // console.log("Inside get group transaction route: ");
    // console.log(group);
    // console.log("groupMember: ", groupMember);
    



    return NextResponse.json(formattedData);
}