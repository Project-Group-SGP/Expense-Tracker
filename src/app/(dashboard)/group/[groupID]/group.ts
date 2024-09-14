"use server";

import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryTypes } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";

export async function AddGroupExpense(params: { 
  groupID: string, 
  paidById: string, 
  title: string, 
  amount: number, 
  date: Date, 
  category: CategoryTypes, 
  splits: { userId: string, amount: number }[] 
}) {
    const user = await currentUserServer();
    
    if (!user) {
        throw new Error("Login Please");
    }

    const groupMembers = await db.groupMember.findMany({
        where: {
          groupId: params.groupID
        }
    });

    // console.log(params.splits);
    

    // console.log( "paidById : " + params.paidById);
    

    // Check if the user is a member of the group
    if (groupMembers.some(member => member.id.toString() === params.paidById.toString())) {
        // console.log('Invalid ID:', params.paidById);
        // console.log("Group members:", groupMembers);
        
        throw new Error("User is not a member of the group");
    }


    // Create the expense record
    const responce = await db.groupExpense.create({
        data: {
            groupId: params.groupID,
            paidById: params.paidById,
            category: params.category,
            amount: params.amount,
            description: params.title,
            date: params.date,
            splits: {
                create: params.splits,
            },
        },
    });

    const updatesplit = await db.expenseSplit.update({
      where:{
        expenseId_userId:{
          expenseId:responce.id,
          userId:params.paidById,
        }
      },
      data:{
        isPaid:"PAID",
      },
      select:{
        id:true,
        expenseId:true,
        isPaid:true,
      }
    })

    // console.log("\n\nupdate expance:",updatesplit);

    // Optionally revalidate cache if needed
    revalidateTag(`group:${params.groupID}`);

    return { success: true };
}  // Assuming you're using Next.js

interface ExpenseDetails {
  expenseid: string;
  amount: number;
  groupexpenceid: string;
}

export async function settleUp(params: {
  groupID: string;
  payerId: string;
  recipientId: string;
  expenseIds: ExpenseDetails[];
  transactionDate: Date;
}) {
  const user = await currentUserServer();
  if (!user || user.id !== params.payerId) {
    throw new Error("Please log in with the correct account.");
  }

  // Fetch group members in a single query
  const groupMembers = await db.groupMember.findMany({
    where: { groupId: params.groupID },
    select: { userId: true },
  });

  const memberIds = new Set(groupMembers.map(member => member.userId));
  if (!memberIds.has(params.payerId) || !memberIds.has(params.recipientId)) {
    throw new Error("Both users must be members of the group.");
  }

  // Fetch all relevant group expenses in a single query
  const groupExpenses = await db.groupExpense.findMany({
    where: {
      id: { in: params.expenseIds.map(e => e.groupexpenceid) },
      groupId: params.groupID,
      paidById: params.recipientId,
      status: { not: "CANCELLED" },
    },
    include: {
      splits: {
        where: { userId: params.payerId },
      },
    },
  });

  const groupExpensesMap = new Map(groupExpenses.map(ge => [ge.id, ge]));

  const updates = params.expenseIds.map(async (expense) => {
    const groupExpense = groupExpensesMap.get(expense.groupexpenceid);
    if (!groupExpense || groupExpense.splits.length === 0) {
      console.warn(`Invalid group expense or split for ID: ${expense.groupexpenceid}`);
      return null;
    }

    const payerSplit = groupExpense.splits[0];

    const [payment, updatedSplit] = await Promise.all([
      db.payment.create({
        data: {
          expenseSplitId: expense.expenseid,
          amount: new Decimal(expense.amount),
          paidAt: params.transactionDate,
        },
      }),
      db.expenseSplit.update({
        where: { id: expense.expenseid },
        data: { isPaid: "PAID" },
      }),
    ]);

    return groupExpense.id;
  });

  const updatedExpenseIds = (await Promise.all(updates)).filter(Boolean) as string[];

  // Update group expense statuses in bulk
  await db.groupExpense.updateMany({
    where: { id: { in: updatedExpenseIds } },
    data: { status: "SETTLED" },
  });

  // Revalidate tags
  revalidateTag(`group:${params.groupID}`);

  return { message: "Payment to group member completed successfully!" };
}

export async function removeUserFromGroup(
  groupId: string,
  userIdToRemove: string
) {
  try {
    // Get the current user's session
    const user = await currentUserServer();

    // Check if the user is authenticated
    if (!user?.id) {
      return { error: "You must be logged in to perform this action." };
    }

    // Find the group and check if the current user is the creator
    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { creatorId: true }
    });

    if (!group) {
      return { error: "Group not found." };
    }

   
    if (userIdToRemove !== user.id) {
      return { error: "Only the user can remove himself" };
    }

    // Remove the user from the group
    await db.groupMember.delete({
      where: {
        userId_groupId: {
          userId: userIdToRemove,
          groupId: groupId
        }
      }
    });

    // Revalidate the group page to reflect the changes
    revalidatePath(`/groups/${groupId}`);

    return { success: "User has been removed from the group." };
  } catch (error) {
    console.error("Error removing user from group:", error);
    return { error: "An error occurred while removing the user from the group." };
  }
}