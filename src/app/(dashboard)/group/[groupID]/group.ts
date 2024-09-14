"use server";

import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryTypes } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidateTag } from "next/cache";

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

// interface expenseDetails {
//   expenseid: string
//   amount: number
//   groupexpenceid: string
// }

// interface Payment {
//   id: string;
//   amount: Decimal;
//   paidAt: Date;
// }
// export async function settleUp(params: {
//   groupID: string;
//   payerId: string;
//   recipientId: string;
//   // amount: number;
//   expenseIds:expenseDetails[];
//   transactionDate: Date;
// }) {
//   // console.log("Params:", params);

//   const user = await currentUserServer();
//   if (!user || user.id !== params.payerId) {
//     throw new Error("Please log in with the correct account.");
//   }

//   const groupMembers = await db.groupMember.findMany({
//     where: { groupId: params.groupID },
//   });
//   // console.log("Group members:", groupMembers);

//   const isPayerMember = groupMembers.some(member => member.userId === params.payerId);
//   const isRecipientMember = groupMembers.some(member => member.userId === params.recipientId);
//   if (!isPayerMember || !isRecipientMember) {
//     throw new Error("Both users must be members of the group.");
//   }

//   // let promises: any[] = [];
//   for (const expense of params.expenseIds) {
//     let remainingAmountToSettle = new Decimal(expense.amount);
//     if (remainingAmountToSettle.lte(0)) break;

//     const groupExpense = await db.groupExpense.findFirst({
//       where: {
//         id: expense.groupexpenceid,
//         groupId: params.groupID,
//         paidById: params.recipientId,
//         status: { not: "CANCELLED" },
//       },
//       include: { splits: true },
//     });
    
//     if (!groupExpense) {
//       console.warn(`Group expense with ID ${expense.expenseid} not found or invalid.`);
//       continue;
//     }

//     const payerSplit = groupExpense.splits.find((split) => split.userId === params.payerId);
//     if (!payerSplit) {
//       console.warn(`No split found for payer in expense ID: ${expense.expenseid}`);
//       continue;
//     }

//     // const totalPaidForSplit = await db.payment.aggregate({
//     //   where: { expenseSplitId: expense.expenseid },
//     //   _sum: { amount: true },
//     // });

//     // const totalPaidAmount = totalPaidForSplit._sum?.amount ?? new Decimal(0);
//     // const remainingAmount = payerSplit.amount.sub(totalPaidAmount);
//     // const paymentAmount = Decimal.min(remainingAmountToSettle, remainingAmount);

//     const payment = await db.payment.create({
//       data: {
//         expenseSplitId: expense.expenseid,
//         amount: expense.amount,
//         paidAt: params.transactionDate,
//       },
//     });

//     // const newTotalPaidAmount = totalPaidAmount.add(paymentAmount);
//     // const newSplitStatus: SplitStatus = 
//     //   newTotalPaidAmount.gte(payerSplit.amount) ? "PAID" :
//     //   newTotalPaidAmount.gt(0) ? "PARTIALLY_PAID" : "UNPAID";

//     const update = await db.expenseSplit.update({
//       where: { id: expense.expenseid },
//       data: { isPaid: "PAID" },
//       // select: {
//       //   id:true,
//       //   expenseId:true,
//       //   isPaid:true
//       // }
//     });

//     // console.log("settleup expance split update ",update);
  
//     const unpaidSplits = await db.expenseSplit.findMany({
//       where: { 
//         expenseId: groupExpense.id, 
//         isPaid: { in: ["UNPAID", "PARTIALLY_PAID"] }
//       },
//     });

//     const newExpenseStatus: ExpenseStatus = 
//       unpaidSplits.length === 0 ? "SETTLED" : "PARTIALLY_SETTLED";

//     const result = await db.groupExpense.update({
//       where: { id: groupExpense.id },
//       data: { status: newExpenseStatus },
//     });

//     // remainingAmountToSettle = remainingAmountToSettle.sub(paymentAmount);
//   }

//   return { message: "Payment to group member completed successfully!" };
// }

// type SplitStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID";
// type ExpenseStatus = "UNSETTLED" | "PARTIALLY_SETTLED" | "SETTLED" | "CANCELLED";
// interface ExpenseDetail {
//   expenseid: string;
//   amount: number;
//   groupexpenceid:string,
// }

// interface SettleUpParams {
//   groupID: string;
//   payerId: string;
//   recipientId: string;
//   expenseIds: ExpenseDetail[];
//   transactionDate: Date;
// }

// export async function settleUp(params: SettleUpParams) {
//   const { groupID, payerId, recipientId, expenseIds, transactionDate } = params;

//   return db.$transaction(async (tx) => {
//     // Validate user
//     const user = await currentUserServer();
//     if (!user || user.id !== payerId) {
//       throw new Error("Unauthorized: Please log in with the correct account.");
//     }

//     // Validate group membership
//     const groupMembers = await tx.groupMember.findMany({
//       where: { groupId: groupID },
//       select: { userId: true },
//     });

//     const memberIds = groupMembers.map(member => member.userId);
//     if (!memberIds.includes(payerId) || !memberIds.includes(recipientId)) {
//       throw new Error("Invalid operation: Both users must be members of the group.");
//     }

//     // Process each expense
//     for (const { expenseid, amount,groupexpenceid } of expenseIds) {
//       const expenseSplit = await tx.expenseSplit.findUnique({
//         where: { id: expenseid },
//         include: { expense: true },
//       });

//       if (!expenseSplit) {
//         throw new Error(`Expense split with ID ${expenseid} not found.`);
//       }

//       if (expenseSplit.expense.groupId !== groupID) {
//         throw new Error(`Expense ${expenseid} does not belong to the specified group.`);
//       }

//       if (expenseSplit.userId !== payerId) {
//         throw new Error(`Expense ${expenseid} is not associated with the payer.`);
//       }

//       const totalPaid = await tx.payment.aggregate({
//         where: { expenseSplitId: expenseid },
//         _sum: { amount: true },
//       });

//       const currentPaidAmount = totalPaid._sum?.amount ?? new Prisma.Decimal(0);
//       const newTotalPaidAmount = currentPaidAmount.add(amount);

//       if (newTotalPaidAmount.gt(expenseSplit.amount)) {
//         throw new Error(`Payment amount for expense ${expenseid} exceeds the owed amount.`);
//       }

//       // Create payment
//       await tx.payment.create({
//         data: {
//           expenseSplitId: expenseid,
//           amount: new Prisma.Decimal(amount),
//           paidAt: transactionDate,
//         },
//       });

//       // Update expense split status
//       const newStatus = newTotalPaidAmount.equals(expenseSplit.amount)
//         ? "PAID"
//         : newTotalPaidAmount.gt(0)
//         ? "PARTIALLY_PAID"
//         : "UNPAID";

//       await tx.expenseSplit.update({
//         where: { id: expenseid },
//         data: { isPaid: newStatus },
//       });
//     }

//     // Perform group expense status updates outside of the loop
//     const groupExpenseStatusUpdate = async () => {
//       for (const { expenseid,groupexpenceid } of expenseIds) {
//         const unpaidSplits = await tx.expenseSplit.count({
//           where: {
//             expenseId: groupexpenceid,
//             isPaid: { in: ["UNPAID", "PARTIALLY_PAID"] },
//           },
//         });

//         const totalSplits = await tx.expenseSplit.count({
//           where: { expenseId: groupexpenceid },
//         });

//         const newExpenseStatus = unpaidSplits === 0
//           ? "SETTLED"
//           : unpaidSplits < totalSplits
//           ? "PARTIALLY_SETTLED"
//           : "UNSETTLED";

//         await tx.groupExpense.update({
//           where: { id: groupexpenceid },
//           data: { status: newExpenseStatus },
//         });
//       }
//     };

//     await groupExpenseStatusUpdate();

//     return { message: "Payment to group member completed successfully!" };
//   });
// }
