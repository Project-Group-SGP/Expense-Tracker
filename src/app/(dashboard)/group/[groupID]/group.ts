"use server";

import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryTypes } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
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
  if (!user || user.id !== params.payerId) {
    throw new Error("Please log in with the correct account.");
  }

  const groupMembers = await db.groupMember.findMany({
    where: { groupId: params.groupID },
  });
  console.log("Group members:", groupMembers);

  const isPayerMember = groupMembers.some(member => member.userId === params.payerId);
  const isRecipientMember = groupMembers.some(member => member.userId === params.recipientId);
  if (!isPayerMember || !isRecipientMember) {
    throw new Error("Both users must be members of the group.");
  }

  let remainingAmountToSettle = new Decimal(params.amount);

  for (const expenseId of params.expenseIds) {
    if (remainingAmountToSettle.lte(0)) break;

    const groupExpense = await db.groupExpense.findFirst({
      where: {
        id: expenseId,
        groupId: params.groupID,
        paidById: params.recipientId,
        status: { not: "CANCELLED" },
      },
      include: { splits: true },
    });

    if (!groupExpense) {
      console.warn(`Group expense with ID ${expenseId} not found or invalid.`);
      continue;
    }

    const payerSplit = groupExpense.splits.find((split) => split.userId === params.payerId);
    if (!payerSplit) {
      console.warn(`No split found for payer in expense ID: ${expenseId}`);
      continue;
    }

    const totalPaidForSplit = await db.payment.aggregate({
      where: { expenseSplitId: payerSplit.id },
      _sum: { amount: true },
    });

    const totalPaidAmount = totalPaidForSplit._sum?.amount ?? new Decimal(0);
    const remainingAmount = payerSplit.amount.sub(totalPaidAmount);
    const paymentAmount = Decimal.min(remainingAmountToSettle, remainingAmount);

    await db.payment.create({
      data: {
        expenseSplitId: payerSplit.id,
        amount: paymentAmount,
        paidAt: params.transactionDate,
      },
    });

    const newTotalPaidAmount = totalPaidAmount.add(paymentAmount);
    const newSplitStatus: SplitStatus = 
      newTotalPaidAmount.gte(payerSplit.amount) ? "PAID" :
      newTotalPaidAmount.gt(0) ? "PARTIALLY_PAID" : "UNPAID";

    const update = await db.expenseSplit.update({
      where: { id: payerSplit.id },
      data: { isPaid: newSplitStatus },
    });

    console.log("inside group.ts");
    console.log();
    

    const unpaidSplits = await db.expenseSplit.findMany({
      where: { 
        expenseId: groupExpense.id, 
        isPaid: { in: ["UNPAID", "PARTIALLY_PAID"] }
      },
    });

    const newExpenseStatus: ExpenseStatus = 
      unpaidSplits.length === 0 ? "SETTLED" : 
      unpaidSplits.some(split => split.isPaid === "PARTIALLY_PAID") || 
      (unpaidSplits.length < groupExpense.splits.length) ? "PARTIALLY_SETTLED" : 
      "UNSETTLED";

    await db.groupExpense.update({
      where: { id: groupExpense.id },
      data: { status: newExpenseStatus },
    });

    remainingAmountToSettle = remainingAmountToSettle.sub(paymentAmount);
  }

  return { message: "Payment to group member completed successfully!" };
}

type SplitStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";
type ExpenseStatus = "UNSETTLED" | "PARTIALLY_SETTLED" | "SETTLED" | "CANCELLED";