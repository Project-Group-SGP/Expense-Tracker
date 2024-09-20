"use server";

import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryTypes } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath, revalidateTag } from "next/cache";
import webpush from "web-push"

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

    if(userIdToRemove !== group.creatorId){
      // Remove the user from the group
      await db.groupMember.delete({
        where: {
          userId_groupId: {
            userId: userIdToRemove,
            groupId: groupId
          }
        }
      });
    }else{
      // delete the group
      await db.group.delete({
        where:{
          id: groupId,
        }
      })
    }

    // Revalidate the group page to reflect the changes
    sendLeaveNotification(groupId,userIdToRemove);

    revalidatePath(`/groups/${groupId}`);

    return { success: "User has been removed from the group." };
  } catch (error) {
    console.error("Error removing user from group:", error);
    return { error: "An error occurred while removing the user from the group." };
  }
}

async function sendLeaveNotification(
  groupId: string,
  userIdToRemove: string
) {
  console.log(
    `Attempting to send Leave notification for group ${groupId} from ${userIdToRemove}`
  )
  try {
    const groupQuery = db.group.findUnique({
      where: { id: groupId },
      include: { creator: { include: { pushSubscriptions: true } } },
    })

    const userIdToRemoveQueryb = db.user.findUnique({
      where: { id: userIdToRemove },
      select: { name: true },
    })

    const [group, userIdToremove] = await Promise.all([groupQuery, userIdToRemoveQueryb])

    if (!group || !group.creator.pushSubscriptions.length || !userIdToremove) {
      console.log(
        `No valid subscriptions found for group ${groupId} or requester not found`
      )
      return
    }

    const notificationPayload = JSON.stringify({
      title: `User has Left the group`,
      body:`${userIdToremove.name} has Left the group "${group.name}"`,
      type: "Leave",
      data: {
        url: `/group/${groupId}`,
        groupId: groupId,
      },
    })

    const sendPromises = group.creator.pushSubscriptions.map(
      async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                auth: subscription.auth,
                p256dh: subscription.p256dh,
              },
            },
            notificationPayload,
            {
              vapidDetails: {
                subject: "mailto:etracker690@gmail.com",
                publicKey: process.env.NEXT_PUBLIC_VAPID_KEY as string,
                privateKey: process.env.PRIVATE_VAPID_KEY as string,
              },
            }
          )
        } catch (error: any) {
          if (error.statusCode === 410) {
            console.log(
              `Subscription expired for endpoint: ${subscription.endpoint}`
            )
            await db.pushSubscription.delete({ where: { id: subscription.id } })
          }
        }
      }
    )

    await Promise.all(sendPromises)
  } catch (error) {
    console.error("Error in Leave notification:", error)
  }
}
interface ExpenseDetails {
  expenseid: string;
  amount: number;
  groupexpenceid: string;
}
async function sendExpenseNotification(
  groupId: string,
  expenseId: string,
  paidById: string,
  amount: number,
  title: string
) {
  try {
    const group = await db.group.findUnique({
      where: { id: groupId },
      include: { 
        members: { 
          include: { 
            user: { 
              include: { pushSubscriptions: true } 
            } 
          } 
        } 
      },
    });

    const payer = await db.user.findUnique({
      where: { id: paidById },
      select: { name: true },
    });

    if (!group || !payer) {
      console.log(`No valid group or payer found for expense ${expenseId}`);
      return;
    }

    const notificationPayload = JSON.stringify({
      title: `New expense in "${group.name}"`,
      body: `${payer.name} added an expense: ${title} (${amount})`,
      type: "NewExpense",
      data: {
        url: `/group/${groupId}`,
        groupId: groupId,
        expenseId: expenseId,
      },
    });

    const sendPromises = group.members.flatMap(member => 
      member.user.pushSubscriptions.map(async (subscription) => {
        if (member.userId === paidById) return; // Don't send notification to the payer
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                auth: subscription.auth,
                p256dh: subscription.p256dh,
              },
            },
            notificationPayload,
            {
              vapidDetails: {
                subject: "mailto:etracker690@gmail.com",
                publicKey: process.env.NEXT_PUBLIC_VAPID_KEY as string,
                privateKey: process.env.PRIVATE_VAPID_KEY as string,
              },
            }
          );
        } catch (error: any) {
          if (error.statusCode === 410) {
            console.log(`Subscription expired for endpoint: ${subscription.endpoint}`);
            await db.pushSubscription.delete({ where: { id: subscription.id } });
          }
        }
      })
    );

    await Promise.all(sendPromises);
  } catch (error) {
    console.error("Error in expense notification:", error);
  }
}

async function sendSettleUpNotification(
  groupId: string,
  payerId: string,
  recipientId: string,
  totalAmount: number
) {
  try {
    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { name: true },
    });

    const [payer, recipient] = await Promise.all([
      db.user.findUnique({
        where: { id: payerId },
        select: { name: true, pushSubscriptions: true },
      }),
      db.user.findUnique({
        where: { id: recipientId },
        select: { name: true, pushSubscriptions: true },
      }),
    ]);

    if (!group || !payer || !recipient) {
      console.log(`No valid group, payer, or recipient found for settle up in group ${groupId}`);
      return;
    }

    const notificationPayload = JSON.stringify({
      title: `Settlement in "${group.name}"`,
      body: `${payer.name} paid ${recipient.name} ₹${totalAmount}`,
      type: "SettleUp",
      data: {
        url: `/group/${groupId}`,
        groupId: groupId,
      },
    });

    const sendPromises = [
      ...payer.pushSubscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                auth: subscription.auth,
                p256dh: subscription.p256dh,
              },
            },
            notificationPayload,
            {
              vapidDetails: {
                subject: "mailto:etracker690@gmail.com",
                publicKey: process.env.NEXT_PUBLIC_VAPID_KEY as string,
                privateKey: process.env.PRIVATE_VAPID_KEY as string,
              },
            }
          );
        } catch (error: any) {
          if (error.statusCode === 410) {
            console.log(`Subscription expired for endpoint: ${subscription.endpoint}`);
            await db.pushSubscription.delete({ where: { id: subscription.id } });
          }
        }
      }),
      ...recipient.pushSubscriptions.map(async (subscription) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                auth: subscription.auth,
                p256dh: subscription.p256dh,
              },
            },
            notificationPayload,
            {
              vapidDetails: {
                subject: "mailto:etracker690@gmail.com",
                publicKey: process.env.NEXT_PUBLIC_VAPID_KEY as string,
                privateKey: process.env.PRIVATE_VAPID_KEY as string,
              },
            }
          );
        } catch (error: any) {
          if (error.statusCode === 410) {
            console.log(`Subscription expired for endpoint: ${subscription.endpoint}`);
            await db.pushSubscription.delete({ where: { id: subscription.id } });
          }
        }
      }),
    ];

    await Promise.all(sendPromises);
  } catch (error) {
    console.error("Error in settle up notification:", error);
  }
}

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

    if (!groupMembers.some(member => member.userId === params.paidById)) {
        throw new Error("User is not a member of the group");
    }

    // Create the expense record
    const response = await db.groupExpense.create({
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

    await db.expenseSplit.update({
      where:{
        expenseId_userId:{
          expenseId: response.id,
          userId: params.paidById,
        }
      },
      data:{
        isPaid: "PAID",
      },
    });

    // Send notification
    sendExpenseNotification(params.groupID, response.id, params.paidById, params.amount, params.title);

    // revalidatePath(`/groups/${params.groupID}`);

    return { success: true };
}

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
      splits: true,
    },
  });

  const groupExpensesMap = new Map(groupExpenses.map(ge => [ge.id, ge]));

  const updates = params.expenseIds.map(async (expense) => {
    const groupExpense = groupExpensesMap.get(expense.groupexpenceid);
    if (!groupExpense) {
      console.warn(`Invalid group expense for ID: ${expense.groupexpenceid}`);
      return null;
    }

    const payerSplit = groupExpense.splits.find(split => split.userId === params.payerId);
    if (!payerSplit) {
      console.warn(`No split found for payer in expense: ${expense.groupexpenceid}`);
      return null;
    }

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

    // Check the status of all splits for this expense
    const allSplitsPaid = groupExpense.splits.every(split => 
      split.id === expense.expenseid ? true : split.isPaid === "PAID"
    );
    const someSplitsPaid = groupExpense.splits.some(split => 
      split.id === expense.expenseid || split.isPaid === "PAID"
    );

    let newStatus;
    if (allSplitsPaid) {
      newStatus = "SETTLED";
    } else if (someSplitsPaid) {
      newStatus = "PARTIALLY_SETTLED";
    } else {
      newStatus = "UNSETTLED";
    }

    await db.groupExpense.update({
      where: { id: expense.groupexpenceid },
      data: { status: newStatus },
    });

    return groupExpense.id;
  });

  await Promise.all(updates);

  // Calculate total amount settled
  const totalAmount = params.expenseIds.reduce((sum, expense) => sum + expense.amount, 0);

  // Send settle up notification
  sendSettleUpNotification(params.groupID, params.payerId, params.recipientId, totalAmount);

  // revalidatePath(`/groups/${params.groupID}`);

  return { message: "Payment to group member completed successfully!" };
}