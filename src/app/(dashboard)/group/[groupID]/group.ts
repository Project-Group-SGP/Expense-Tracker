"use server";

import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryTypes } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { split } from "postcss/lib/list";

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

    console.log(params.splits);
    

    console.log( "paidById : " + params.paidById);
    

    // Check if the user is a member of the group
    if (groupMembers.some(member => member.id.toString() === params.paidById.toString())) {
        console.log('Invalid ID:', params.paidById);
        console.log("Group members:", groupMembers);
        
        throw new Error("User is not a member of the group");
    }

    // Create the expense record
    await db.groupExpense.create({
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

    // Optionally revalidate cache if needed
    revalidateTag(`group:${params.groupID}`);

    return { success: true };
}


export async function settleUp(params: {
    groupID: string;
    payerId: string;
    recipientId: string;
    amount: number;
  }) {
    console.log("Params:", params);

    const user = await currentUserServer();
    if (!user || user.id != params.payerId) {
      throw new Error("Please log in with the correct account.");
    }
    
    // Fetch group members to ensure both users are part of the group
    const groupMembers = await db.groupMember.findMany({
      where: {
        groupId: params.groupID,
      },
    });
    console.log("Group members:", groupMembers);
    
    // Check if both users are members
    const isPayerMember = groupMembers.some(member => member.userId === params.payerId);
    const isRecipientMember = groupMembers.some(member => member.userId === params.recipientId);
    if (!isPayerMember || !isRecipientMember) {
      throw new Error("Both users must be members of the group.");
    }
    
    // Retrieve the group expense where the recipient is owed money
    const groupExpense = await db.groupExpense.findFirst({
      where: {
        groupId: params.groupID,
        paidById: params.recipientId,
        status: {
          not: "CANCELLED",
        },
      },
      include: {
        splits: true,
      },
    });
    console.log("Inside group.ts");
    
    console.log("Group expense:", groupExpense);
    
    if (!groupExpense) {
      throw new Error("No valid group expense found for settlement.");
    }
    
    // Find the payer's specific split for the expense
    const payerSplit = groupExpense.splits.find(
      (split) => split.userId === params.payerId
    );
    console.log("Payer's expense split:", payerSplit);
    
    if (!payerSplit) {
      throw new Error("No expense split found for the payer.");
    }
    
    // Calculate total paid for the split
    const totalPaidForSplit = await db.payment.aggregate({
      where: { expenseSplitId: payerSplit.id },
      _sum: {
        amount: true,
      },
    });
    
    const totalPaidAmount = totalPaidForSplit._sum?.amount ?? 0;
    const remainingAmount = Number(payerSplit.amount) - Number(totalPaidAmount);
    
    const paymentAmount = params.amount;
    
    if (paymentAmount > remainingAmount) {
      throw new Error("Payment amount exceeds the remaining unpaid portion.");
    }
    
    // Create a payment record
    await db.payment.create({
      data: {
        expenseSplitId: payerSplit.id,
        amount: paymentAmount,
      },
    });
    
    // Update the status of the split
    let newSplitStatus: "PAID" | "PARTIALLY_PAID";
    if (paymentAmount === remainingAmount) {
      newSplitStatus = "PAID";
    } else {
      newSplitStatus = "PARTIALLY_PAID";
    }
    
    await db.expenseSplit.update({
      where: { id: payerSplit.id },
      data: {
        isPaid: newSplitStatus,
      },
    });
    
    // Check the status of all splits for the expense
    const allSplits = await db.expenseSplit.findMany({
      where: { expenseId: groupExpense.id },
    });
    
    const allPaid = allSplits.every((split) => split.isPaid === "PAID");
    let newExpenseStatus: "SETTLED" | "PARTIALLY_SETTLED";
    
    if (allPaid) {
      newExpenseStatus = "SETTLED";
    } else {
      newExpenseStatus = "PARTIALLY_SETTLED";
    }
    
    // Update the overall group expense status
    await db.groupExpense.update({
      where: { id: groupExpense.id },
      data: {
        status: newExpenseStatus,
      },
    });
    
    return { message: "Payment to group member completed successfully!" };
}