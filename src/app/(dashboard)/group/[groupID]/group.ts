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
  expenseIds: string[];
  transactionDate: Date;
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

  // Process each selected expense
  for (const expenseId of params.expenseIds) {
    const groupExpense = await db.groupExpense.findFirst({
      where: {
        id: expenseId,
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

    if (!groupExpense) {
      throw new Error(`No valid group expense found for settlement with ID: ${expenseId}`);
    }

    // Find the payer's specific split for the expense
    const payerSplit = groupExpense.splits.find(
      (split) => split.userId === params.payerId
    );

    if (!payerSplit) {
      throw new Error(`No expense split found for the payer in expense with ID: ${expenseId}`);
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

    // Determine the payment amount for this specific expense
    const paymentAmount = Math.min(params.amount, remainingAmount);

    // Create a payment record
    await db.payment.create({
      data: {
        expenseSplitId: payerSplit.id,
        amount: paymentAmount,
        paidAt: params.transactionDate,
      },
    });

    // Update the status of the split
    let newSplitStatus: "PAID" | "PARTIALLY_PAID" = 
      paymentAmount >= remainingAmount ? "PAID" : "PARTIALLY_PAID";

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
    let newExpenseStatus: "SETTLED" | "PARTIALLY_SETTLED" = 
      allPaid ? "SETTLED" : "PARTIALLY_SETTLED";

    // Update the overall group expense status
    await db.groupExpense.update({
      where: { id: groupExpense.id },
      data: {
        status: newExpenseStatus,
      },
    });

    // Reduce the remaining amount to settle for the next expense
    params.amount -= paymentAmount;
    if (params.amount <= 0) break;
  }

  return { message: "Payment to group member completed successfully!" };
}