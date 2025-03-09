"use server"

import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { logo } from "@/lib/logo"
import { CategoryTypes, Prisma } from "@prisma/client"
import { createCanvas } from "canvas"
import { Chart, registerables } from "chart.js";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { revalidatePath } from "next/cache"
import webpush from "web-push"
import * as XLSX from "xlsx"
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables, ChartDataLabels);

export async function removeUserFromGroup(
  groupId: string,
  userIdToRemove: string
) {
  try {
    // Get the current user's session
    const user = await currentUserServer()

    // Check if the user is authenticated
    if (!user?.id) {
      return { error: "You must be logged in to perform this action." }
    }

    // Find the group and check if the current user is the creator
    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { creatorId: true },
    })

    if (!group) {
      return { error: "Group not found." }
    }

    if (userIdToRemove !== user.id) {
      return { error: "Only the user can remove himself" }
    }

    if (userIdToRemove !== group.creatorId) {
      // Remove the user from the group
      await db.groupMember.delete({
        where: {
          userId_groupId: {
            userId: userIdToRemove,
            groupId: groupId,
          },
        },
      })
    } else {
      // delete the group
      await db.group.delete({
        where: {
          id: groupId,
        },
      })
    }

    // Revalidate the group page to reflect the changes
    sendLeaveNotification(groupId, userIdToRemove)

    revalidatePath(`/groups/${groupId}`)

    return { success: "User has been removed from the group." }
  } catch (error) {
    console.error("Error removing user from group:", error)
    return {
      error: "An error occurred while removing the user from the group.",
    }
  }
}

async function sendLeaveNotification(groupId: string, userIdToRemove: string) {
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

    const [group, userIdToremove] = await Promise.all([
      groupQuery,
      userIdToRemoveQueryb,
    ])

    if (!group || !group.creator.pushSubscriptions.length || !userIdToremove) {
      console.log(
        `No valid subscriptions found for group ${groupId} or requester not found`
      )
      return
    }

    const notificationPayload = JSON.stringify({
      title: `User has Left the group`,
      body: `${userIdToremove.name} has Left the group "${group.name}"`,
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
  expenseid: string
  amount: number
  groupexpenceid: string
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
              include: { pushSubscriptions: true },
            },
          },
        },
      },
    })

    const payer = await db.user.findUnique({
      where: { id: paidById },
      select: { name: true },
    })

    if (!group || !payer) {
      console.log(`No valid group or payer found for expense ${expenseId}`)
      return
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
    })

    const sendPromises = group.members.flatMap((member) =>
      member.user.pushSubscriptions.map(async (subscription) => {
        if (member.userId === paidById) return // Don't send notification to the payer
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
      })
    )

    await Promise.all(sendPromises)
  } catch (error) {
    console.error("Error in expense notification:", error)
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
    })

    const [payer, recipient] = await Promise.all([
      db.user.findUnique({
        where: { id: payerId },
        select: { name: true, pushSubscriptions: true },
      }),
      db.user.findUnique({
        where: { id: recipientId },
        select: { name: true, pushSubscriptions: true },
      }),
    ])

    if (!group || !payer || !recipient) {
      console.log(
        `No valid group, payer, or recipient found for settle up in group ${groupId}`
      )
      return
    }

    const notificationPayload = JSON.stringify({
      title: `Settlement in "${group.name}"`,
      body: `${payer.name} paid ${recipient.name} ₹${totalAmount}`,
      type: "SettleUp",
      data: {
        url: `/group/${groupId}`,
        groupId: groupId,
      },
    })

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
          )
        } catch (error: any) {
          if (error.statusCode === 410) {
            console.log(
              `Subscription expired for endpoint: ${subscription.endpoint}`
            )
            await db.pushSubscription.delete({ where: { id: subscription.id } })
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
          )
        } catch (error: any) {
          if (error.statusCode === 410) {
            console.log(
              `Subscription expired for endpoint: ${subscription.endpoint}`
            )
            await db.pushSubscription.delete({ where: { id: subscription.id } })
          }
        }
      }),
    ]

    await Promise.all(sendPromises)
  } catch (error) {
    console.error("Error in settle up notification:", error)
  }
}

// export async function AddGroupExpense(params: {
//   groupID: string
//   paidById: string
//   title: string
//   amount: number
//   date: Date
//   category: CategoryTypes
//   splits: { userId: string; amount: number }[]
// }) {
//   const result = await db.$transaction(async (prisma) => {
//     const user = await currentUserServer()
//     if (!user) {
//       throw new Error("Login Please")
//     }

//     const groupMembers = await prisma.groupMember.findMany({
//       where: {
//         groupId: params.groupID,
//       },
//     })

//     if (!groupMembers.some((member) => member.userId === params.paidById)) {
//       throw new Error("User is not a member of the group")
//     }

//     // Create the new expense record
//     const newExpense = await prisma.groupExpense.create({
//       data: {
//         groupId: params.groupID,
//         paidById: params.paidById,
//         category: params.category,
//         amount: params.amount,
//         description: params.title,
//         date: params.date,
//         splits: {
//           create: params.splits,
//         },
//       },
//       include: {
//         splits: true
//       }
//     })

//     // Mark the split for the person who paid as PAID
//     await prisma.expenseSplit.update({
//       where: {
//         expenseId_userId: {
//           expenseId: newExpense.id,
//           userId: params.paidById,
//         },
//       },
//       data: {
//         isPaid: "PAID",
//       },
//     })

//     // Find all unsettled expense splits in the group
//     const unsettledExpenseSplits = await prisma.expenseSplit.findMany({
//       where: {
//         isPaid: {
//           not: "PAID"
//         },
//         expense: {
//           groupId: params.groupID,
//         },
//       },
//       include: {
//         expense: true,
//         user: true
//       }
//     })

//     // Create a settlement matrix
//     const settlementMatrix = new Map<string, number>()

//     // Calculate net balances for each user
//     for (const split of unsettledExpenseSplits) {
//       const paidByKey = split.expense.paidById
//       const owedToKey = split.userId
//       const amount = Number(split.amount)

//       // Adjust settlement matrix
//       settlementMatrix.set(paidByKey, (settlementMatrix.get(paidByKey) || 0) + amount)
//       settlementMatrix.set(owedToKey, (settlementMatrix.get(owedToKey) || 0) - amount)
//     }

//     // Identify and settle offsetting transactions
//     const userBalances = Array.from(settlementMatrix.entries())
//     userBalances.sort((a, b) => b[1] - a[1])

//     while (userBalances.length > 0) {
//       const [creditor, creditorBalance] = userBalances[0]
//       const [debtor, debtorBalance] = userBalances[userBalances.length - 1]

//       if (Math.abs(debtorBalance) < 0.01 || Math.abs(creditorBalance) < 0.01) {
//         break
//       }

//       const settlementAmount = Math.min(Math.abs(debtorBalance), creditorBalance)

//       // Find matching unsettled splits to update
//       const matchingSplits = unsettledExpenseSplits.filter(
//         split => (split.expense.paidById === debtor && split.userId === creditor) ||
//                  (split.expense.paidById === creditor && split.userId === debtor)
//       )

//       // Update matching splits
//       for (const split of matchingSplits) {
//         const updateAmount = Math.min(settlementAmount, Number(split.amount))
        
//         if (updateAmount > 0) {
//           await prisma.expenseSplit.update({
//             where: { id: split.id },
//             data: {
//               isPaid: updateAmount === Number(split.amount) ? "PAID" : "PARTIALLY_PAID"
//             }
//           })

//           // Update corresponding group expense status
//           await prisma.groupExpense.update({
//             where: { id: split.expenseId },
//             data: {
//               status: updateAmount === Number(split.amount) ? "SETTLED" : "PARTIALLY_SETTLED"
//             }
//           })
//         }
//       }

//       // Update balances
//       userBalances[0][1] -= settlementAmount
//       userBalances[userBalances.length - 1][1] += settlementAmount

//       // Resort and remove zero balance entries
//       userBalances.sort((a, b) => b[1] - a[1])
//       while (userBalances.length > 0 && Math.abs(userBalances[userBalances.length - 1][1]) < 0.01) {
//         userBalances.pop()
//       }
//     }

//      // Send notification
//       sendExpenseNotification(
//         params.groupID,
//         newExpense.id,
//         params.paidById,
//         params.amount,
//         params.title
//       )

//     revalidatePath(`/group/${params.groupID}`)
//     return { success: true, expenseId: newExpense.id }
//   })

//   return result;
// }

export async function AddGroupExpense(params: {
  groupID: string
  paidById: string
  title: string
  amount: number
  date: Date
  category: CategoryTypes
  splits: { userId: string; amount: number }[]
}) {
  const user = await currentUserServer();

  if (!user) {
    throw new Error("Login Please")
  }

  const groupMembers = await db.groupMember.findMany({
    where: {
      groupId: params.groupID,
    },
  })

  if (!groupMembers.some((member) => member.userId === params.paidById)) {
    throw new Error("User is not a member of the group")
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
  })

  await db.expenseSplit.update({
    where: {
      expenseId_userId: {
        expenseId: response.id,
        userId: params.paidById,
      },
    },
    data: {
      isPaid: "PAID",
    },
  })

  // Send notification
  sendExpenseNotification(
    params.groupID,
    response.id,
    params.paidById,
    params.amount,
    params.title
  )

  revalidatePath(`/group/${params.groupID}`)

  return { success: true }
}

// interface ExpenseDetails {
//   expenseid: string
//   amount: number
//   groupexpenceid: string
// }

// export async function settleUp(params: {
//   groupID: string
//   payerId: string
//   recipientId: string
//   expenseIds: ExpenseDetails[]
//   transactionDate: Date
// }) {
//   const user = await currentUserServer()
//   if (!user || user.id !== params.payerId) {
//     throw new Error("Please log in with the correct account.")
//   }

//   // Fetch group members in a single query
//   const groupMembers = await db.groupMember.findMany({
//     where: { groupId: params.groupID },
//     select: { userId: true },
//   })

//   const memberIds = new Set(groupMembers.map((member) => member.userId))
//   if (!memberIds.has(params.payerId) || !memberIds.has(params.recipientId)) {
//     throw new Error("Both users must be members of the group.")
//   }

//   // Fetch all relevant group expenses in a single query
//   const groupExpenses = await db.groupExpense.findMany({
//     where: {
//       id: { in: params.expenseIds.map((e) => e.groupexpenceid) },
//       groupId: params.groupID,
//       paidById: params.recipientId,
//       status: { not: "CANCELLED" },
//     },
//     include: {
//       splits: true,
//     },
//   })

//   const groupExpensesMap = new Map(groupExpenses.map((ge) => [ge.id, ge]))

//   const updates = params.expenseIds.map(async (expense) => {
//     const groupExpense = groupExpensesMap.get(expense.groupexpenceid)
//     if (!groupExpense) {
//       console.warn(`Invalid group expense for ID: ${expense.groupexpenceid}`)
//       return null
//     }

//     const payerSplit = groupExpense.splits.find(
//       (split) => split.userId === params.payerId
//     )
//     if (!payerSplit) {
//       console.warn(
//         `No split found for payer in expense: ${expense.groupexpenceid}`
//       )
//       return null
//     }

//     const [payment, updatedSplit] = await Promise.all([
//       db.payment.create({
//         data: {
//           expenseSplitId: expense.expenseid,
//           amount: new Decimal(expense.amount),
//           paidAt: params.transactionDate,
//         },
//       }),
//       db.expenseSplit.update({
//         where: { id: expense.expenseid },
//         data: { isPaid: "PAID" },
//       }),
//     ])

//     // Check the status of all splits for this expense
//     const allSplitsPaid = groupExpense.splits.every((split) =>
//       split.id === expense.expenseid ? true : split.isPaid === "PAID"
//     )
//     const someSplitsPaid = groupExpense.splits.some(
//       (split) => split.id === expense.expenseid || split.isPaid === "PAID"
//     )

//     let newStatus
//     if (allSplitsPaid) {
//       newStatus = "SETTLED"
//     } else if (someSplitsPaid) {
//       newStatus = "PARTIALLY_SETTLED"
//     } else {
//       newStatus = "UNSETTLED"
//     }

//     await db.groupExpense.update({
//       where: { id: expense.groupexpenceid },
//       data: { status: newStatus },
//     })

//     return groupExpense.id
//   })

//   await Promise.all(updates)

//   // Calculate total amount settled
//   const totalAmount = params.expenseIds.reduce(
//     (sum, expense) => sum + expense.amount,
//     0
//   )

//   // Send settle up notification
//   sendSettleUpNotification(
//     params.groupID,
//     params.payerId,
//     params.recipientId,
//     totalAmount
//   )

//   revalidatePath(`/group/${params.groupID}`)

//   return { message: "Payment to group member completed successfully!" }
// }


interface SettleUpData {
  fromUser: string;
  toUser: string;
  selectedExpenses: string[];
  isNetSettle: boolean;
  groupID: string;
}

export async function settleUp(data: SettleUpData) {
  try {
    const user = await currentUserServer();
    if (!user) {
      throw new Error("Unauthorized");
    }

    if (data.fromUser !== user.id) {
      throw new Error("You can only settle your own expenses");
    }

    // Validate group membership
    const group = await db.group.findFirst({
      where: {
        id: data.groupID,
        members: {
          some: {
            userId: user.id
          }
        }
      }
    });

    if (!group) {
      throw new Error("Group not found or you're not a member");
    }

    // Start transaction
    await db.$transaction(async (tx) => {
      if (data.isNetSettle) {
        // Handle net settlement
        const payableSplits = await tx.expenseSplit.findMany({
          where: {
            userId: user.id,
            expense: {
              groupId: data.groupID,
              paidById: data.toUser,
            },
            isPaid: "UNPAID",
          },
        });

        const receivableSplits = await tx.expenseSplit.findMany({
          where: {
            userId: data.toUser,
            expense: {
              groupId: data.groupID,
              paidById: user.id,
            },
            isPaid: "UNPAID",
          },
        });

        // Update all splits
        await Promise.all([
          ...payableSplits.map(split => 
            tx.expenseSplit.update({
              where: { id: split.id },
              data: { isPaid: "PAID" }
            })
          ),
          ...receivableSplits.map(split => 
            tx.expenseSplit.update({
              where: { id: split.id },
              data: { isPaid: "PAID" }
            })
          )
        ]);

        // Update expense statuses
        const expenseIds = [...new Set([
          ...payableSplits.map(split => split.expenseId),
          ...receivableSplits.map(split => split.expenseId)
        ])];

        await updateExpenseStatuses(tx, expenseIds);
      } else {
        // Handle individual expense settlements
        await Promise.all(
          data.selectedExpenses.map(async (splitId) => {
            const split = await tx.expenseSplit.findUnique({
              where: { id: splitId },
              include: { expense: true }
            });

            if (!split) {
              throw new Error(`Split ${splitId} not found`);
            }

            await tx.expenseSplit.update({
              where: { id: splitId },
              data: { isPaid: "PAID" }
            });

            await updateExpenseStatuses(tx, [split.expenseId]);
          })
        );
      }
    });
    
    revalidatePath(`/groups/${data.groupID}`);
    return { success: true };
  } catch (error) {
    console.error("Error in settleUp:", error);
    throw error;
  }
}

async function updateExpenseStatuses(tx: any, expenseIds: string[]) {
  await Promise.all(
    expenseIds.map(async (expenseId) => {
      const allSplits = await tx.expenseSplit.findMany({
        where: { expenseId }
      });

      const unpaidSplits = allSplits.filter(split => split.isPaid === "UNPAID");

      const newStatus = unpaidSplits.length === 0 ? "SETTLED" : "UNSETTLED";

      await tx.groupExpense.update({
        where: { id: expenseId },
        data: { status: newStatus }
      });
    })
  );
}
// _services/groupServices.ts

interface Group {
  id: string
  name: string
}

interface GroupMemberDetails {
  userId: string
  name: string
  avatar: string
}

interface User {
  id: string
  name: string
  image: string
}

interface Payment {
  amount: number
}

interface Expense {
  paidBy: User[]
}

interface ExpenseSplit {
  amount: number
  expense: Expense
  payments: Payment[]
}

interface UserToPay {
  id: string
  memberName: string
  memberId: string
  amountToPay: number
  groupexpanceid: string
}

interface GetResponse {
  group: Group | null
  pendingPayments: ExpenseSplit[]
  usersToPay: UserToPay[]
}

type ExpenseSplitStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID"

interface ExpenseSplit {
  userName: string
  expenseId: string
  amount: number
  isPaid: ExpenseSplitStatus
}

export interface FormattedExpenseData {
  groupId: string
  expenseId: string
  amount: number
  category: string
  paidById: string
  PaidByName: string
  description: string
  date: string
  status: "UNSETTLED" | "PARTIALLY_SETTLED" | "SETTLED" | "CANCELLED"
  expenseSplits: ExpenseSplit[]
}

export interface GetBalance {
  userId: string
  name: string
  avatar: string
  amount: number
  status: "settled up" | "gets back" | "owes"
  amountColor: string
  detailedBalance: DetailedBalance[]
}

interface DetailedBalance {
  userId: string
  name: string
  amount: string
  status: "gets back" | "owes"
}

 export interface TransactionSummary {
  member: {
    id: string;
    name: string;
  };
  transactions: {
    payable: {
      id: string;
      amount: number;
      expense: {
        id: string;
        description: string;
      };
    }[];
    receivable: {
      id: string;
      amount: number;
      expense: {
        id: string;
        description: string;
      };
    }[];
  };
  summary: {
    totalPayable: number;
    totalReceivable: number;
    netBalance: number;
    balanceStatus: "receivable" | "payable";
  };
}

export async function getAllData(
  groupID: string,
  cookie: string
): Promise<TransactionSummary[]> {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/get-group?groupID=${groupID}`,
      {
        method: "GET",
        headers: { Cookie: cookie },
        next: { tags: ["getGroupdata"] },
        cache: "force-cache",
      }
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const transactionsSummary: TransactionSummary[] = await res.json();

    return transactionsSummary;
  } catch (error) {
    console.error("Error fetching data:", error);

    // Return an empty array as fallback for the API return type
    return [];
  }
}


export async function fetchGroupBalances(
  groupId: string,
  cookie: string
): Promise<GetBalance[]> {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/balance?groupId=${groupId}`,
      {
        method: "GET",
        headers: { Cookie: cookie },
        next: { tags: ["getGroupBalance"] },
        cache: "force-cache",
      }
    )

    if (!res.ok) {
      throw new Error("Failed to fetch group balances")
    }

    const data: GetBalance[] = await res.json()
    console.log("\n\n\n\n Balance", data)
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    return []
  }
}

export async function getGroupTransactionData(
  groupID: string,
  cookie: string
): Promise<FormattedExpenseData[]> {
  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/get-group-transaction?groupID=${groupID}`,
      {
        method: "GET",
        headers: { Cookie: cookie },
        cache: "force-cache",
        next: { tags: ["getGroupTransactiondata"] },
      }
    )

    if (!res.ok) {
      throw new Error("Network response was not ok")
    }

    const data: FormattedExpenseData[] = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    return []
  }
}


export async function deleteGroupTransaction(groupId: string, expenseId: string) {
  try {
    // Validate input
    if (!groupId || !expenseId) {
      return { 
        error: 'Invalid group or expense ID',
        success: false 
      };
    }

    // Perform the database operation
    const expense = await db.groupExpense.findUnique({
      where: {
        id: expenseId,
        groupId: groupId
      }
    });

    // Check if expense exists and belongs to the group
    if (!expense) {
      return { 
        error: 'Expense not found or does not belong to the specified group',
        success: false 
      };
    }

    // Delete associated expense splits
    await db.expenseSplit.deleteMany({
      where: {
        expenseId: expenseId
      }
    });

    // Delete the group expense
    await db.groupExpense.delete({
      where: {
        id: expenseId
      }
    });

    // Return success response
    return { 
      success: true,
      error: null
    };

  } catch (error) {
    // Log the error and return an error response
    console.error('Error deleting group transaction:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

interface ChartData {
  labels: string[];
  values: number[];
}

export async function generateGroupReport(
  groupId: string,
  reportType: string,
  startDate?: Date,
  endDate?: Date,
  reportFormat: string = "pdf",
  includeCharts: boolean = true,
  isDetailed: boolean = false,
  selectedCategories: CategoryTypes[] = [],
  includeMemberDetails: boolean = false
): Promise<{
  buffer: string;
  mimeType: string;
  fileExtension: string;
  name?: string;
}> {
  const user = await currentUserServer();
  if (!user) {
    throw new Error("Please login");
  }

  // Verify user is a member of the group
  const groupMember = await db.groupMember.findFirst({
    where: {
      userId: user.id,
      groupId,
    },
    include: {
      group: true,
    },
  });

  if (!groupMember) {
    throw new Error("You are not a member of this group");
  }

  let start: Date, end: Date;
  switch (reportType) {
    case "last_month":
      start = startOfMonth(subMonths(new Date(), 1));
      end = endOfMonth(subMonths(new Date(), 1));
      break;
    case "last_3_months":
      start = startOfMonth(subMonths(new Date(), 3));
      end = endOfMonth(new Date());
      break;
    case "last_6_months":
      start = startOfMonth(subMonths(new Date(), 6));
      end = endOfMonth(new Date());
      break;
    case "custom":
      if (!startDate || !endDate) {
        throw new Error("Custom date range requires start and end dates");
      }
      start = startDate;
      end = endDate;
      break;
    default:
      throw new Error("Invalid report type");
  }

  // Fetch group expenses
  const expenseQuery: Prisma.GroupExpenseFindManyArgs = {
    where: {
      groupId,
      date: {
        gte: start,
        lte: end,
      },
      ...(selectedCategories.length > 0 && {
        category: { in: selectedCategories },
      }),
    },
    include: {
      splits: {
        include: {
          user: true,
          payments: true,
        },
      },
      paidBy: true,
    },
    orderBy: {
      date: "asc",
    },
  };

  const expensesByCategory = await db.groupExpense.groupBy({
    by: ["category"],
    where: {
      groupId,
      date: {
        gte: start,
        lte: end,
      },
      ...(selectedCategories.length > 0 && {
        category: { in: selectedCategories },
      }),
    },
    _sum: {
      amount: true,
    },
  });

  const groupExpenses = await db.groupExpense.findMany(expenseQuery);

  const pieChartData: ChartData = {
    labels: Object.values(CategoryTypes).filter(
      (cat) =>
        selectedCategories.length === 0 || selectedCategories.includes(cat)
    ),
    values: Object.values(CategoryTypes)
      .filter(
        (cat) =>
          selectedCategories.length === 0 || selectedCategories.includes(cat)
      )
      .map((cat) =>
        Number(
          expensesByCategory.find((exp) => exp.category === cat)?._sum.amount ||
            0
        )
      ),
  };

  let reportBuffer: Buffer;
  let mimeType: string;
  let fileExtension: string;

  if (reportFormat === "pdf") {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Enhanced header with logo function
    const addHeaderWithLogo = (pageNumber: number) => {
      const headerHeight = 40;
      const margin = 10;

      doc
        .setFillColor(230, 250, 230)
        .setDrawColor(76, 175, 80)
        .setLineWidth(1)
        .rect(0, 0, pageWidth, headerHeight, "FD");

      const logoWidth = 20;
      const logoHeight = 20;
      doc.addImage(
        logo,
        "PNG",
        margin,
        (headerHeight - logoHeight) / 2,
        logoWidth,
        logoHeight
      );

      doc.setFontSize(24);
      doc.setTextColor(46, 125, 50);
      doc.setFont("helvetica", "bold");
      doc.text("spend", margin + 23, headerHeight / 2 + 2);
      doc.setTextColor(76, 175, 80);
      doc.text(
        "Wise",
        margin + doc.getTextWidth("spend") + 23,
        headerHeight / 2 + 2
      );

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.text(`Group: ${groupMember.group.name}`, pageWidth - margin, 15, {
        align: "right",
      });
      const periodText = `Period: ${format(start, "dd MMM yyyy")} - ${format(
        end,
        "dd MMM yyyy"
      )}`;
      doc.text(periodText, pageWidth - margin, 25, { align: "right" });
      doc.setFontSize(8);
      doc.text(`Page ${pageNumber}`, pageWidth - margin, headerHeight - 5, {
        align: "right",
      });
    };

    addHeaderWithLogo(1);

    doc.setFontSize(20);
    doc.setTextColor("#2E7D32");
    doc.setFont("helvetica", "bold");
    doc.text("Group Expense Report", 14, 55);

    // Add report metadata section
    doc.setFontSize(10);
    doc.setTextColor("#555555");
    doc.setFont("helvetica", "normal");
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 65);
    doc.text(
      `Report Type: ${reportType.replace(/_/g, " ").toUpperCase()}`,
      14,
      72
    );
    doc.text(`Generated By: ${user.name}`, 14, 79);

    // Add group summary information
    const memberCount = await db.groupMember.count({ where: { groupId } });
    doc.setFontSize(12);
    doc.setTextColor("#1976D2");
    doc.setFont("helvetica", "bold");
    doc.text("Group Summary", 14, 90);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#555555");

    if (groupExpenses.length === 0) {
      doc.setFontSize(14);
      doc.setTextColor("#F44336");
      doc.text("No group expenses recorded for the selected period.", 14, 110);
    } else {
      const totalExpenses = groupExpenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );

      // Add expense summary metrics
      const expenseCount = groupExpenses.length;
      const avgExpense = totalExpenses / expenseCount;
      const maxExpense = Math.max(
        ...groupExpenses.map((e) => Number(e.amount))
      );
      const minExpense = Math.min(
        ...groupExpenses.map((e) => Number(e.amount))
      );

      // Group by month for trend analysis
      const monthlyExpenses = groupExpenses.reduce((acc, expense) => {
        const month = format(expense.date, "MMM yyyy");
        if (!acc[month]) acc[month] = 0;
        acc[month] += Number(expense.amount);
        return acc;
      }, {} as Record<string, number>);

      // Get top spenders
      const memberExpenses = await db.groupExpense.groupBy({
        by: ["paidById"],
        where: {
          groupId,
          date: {
            gte: start,
            lte: end,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const topSpenderIds = memberExpenses
        //@ts-ignore
        .sort((a, b) => (b._sum.amount as number) - (a._sum.amount as number))
        .slice(0, 3)
        .map((m) => m.paidById);

      const topSpenders = await db.user.findMany({
        where: {
          id: {
            in: topSpenderIds,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      const spenderMap = topSpenders.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
      }, {} as Record<string, string>);

      doc.text(`Total Expenses: ${expenseCount}`, 14, 100);
      doc.text(`Average Expense: ${avgExpense.toFixed(2)}`, 14, 107);
      doc.text(`Largest Expense: ${maxExpense.toFixed(2)}`, 14, 114);
      doc.text(`Smallest Expense: ${minExpense.toFixed(2)}`, 14, 121);

      // Add top spenders section
      doc.setFontSize(12);
      doc.setTextColor("#1976D2");
      doc.setFont("helvetica", "bold");
      doc.text("Top Contributors", pageWidth / 2 + 10, 90);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor("#555555");

      let yPos = 100;
      memberExpenses
        //@ts-ignore
        .sort((a, b) => (b._sum.amount as number) - (a._sum.amount as number))
        .slice(0, 3)
        .forEach((member, idx) => {
          const name = spenderMap[member.paidById] || "Unknown User";
          const amount = Number(member._sum.amount).toFixed(2);
          const percentage = (
            (Number(member._sum.amount) * 100) /
            totalExpenses
          ).toFixed(1);
          doc.text(
            `${idx + 1}. ${name}: ${amount} (${percentage}%)`,
            pageWidth / 2 + 10,
            yPos
          );
          yPos += 7;
        });

      let chartYPos = 0;

      if (includeCharts) {
        // Calculate chart position based on previous content
        chartYPos = Math.max(yPos, 130) + 10;

        // Expense pie chart
        const pieChartBase64 = await generatePieChart(pieChartData);
        doc.addImage(
          `data:image/png;base64,${pieChartBase64}`,
          "PNG",
          50,
          chartYPos,
          110,
          100
        );

        doc.setFontSize(16);
        doc.setTextColor("#2E7D32");
        doc.setFont("helvetica", "bold");
        doc.text("Expense Distribution", 14, chartYPos + 108);

        // Add expense distribution labels
        let leftCol = 20;
        let rightCol = pageWidth / 2 + 10;
        let labelYPos = chartYPos + 118;
        expensesByCategory.forEach((category, index) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(60, 60, 60);
          const text = `${category.category || "Uncategorized"}: -${Number(
            category._sum.amount || 0
          ).toFixed(2)}`;
          const rectWidth = 3;
          const rectHeight = 3;
          const rectX = index % 2 === 0 ? leftCol - 5 : rightCol - 5;
          const rectY = labelYPos - 3;
          const colors: { [key: string]: string } = {
            Other: "#4CAF50",
            Bills: "#2196F3",
            Food: "#FFC107",
            Entertainment: "#F44336",
            Transportation: "#9C27B0",
            EMI: "#00BCD4",
            Healthcare: "#FF9800",
            Education: "#795548",
            Investment: "#607D8B",
            Shopping: "#E91E63",
            Fuel: "#9E9E9E",
            Groceries: "#FF5722",
          };
          doc.setFillColor(colors[category.category || "Other"]);
          doc.rect(rectX, rectY, rectWidth, rectHeight, "F");

          // Add percentage information
          const percentage =
            ((category._sum.amount as any) * 100) / totalExpenses;
          doc.text(
            `${text} (${percentage.toFixed(2)}%)`,
            index % 2 === 0 ? leftCol : rightCol,
            labelYPos
          );

          if (index % 2 !== 0) labelYPos += 8;
        });

        // Add monthly trend data if we have multiple months
        if (Object.keys(monthlyExpenses).length > 1) {
          // Add a new page for the trend chart if needed
          if (labelYPos > pageHeight - 100) {
            doc.addPage();
            //@ts-ignore
            addHeaderWithLogo(doc.internal.getNumberOfPages());
            labelYPos = 70;
          } else {
            labelYPos += 30;
          }

          // Create monthly trend bar chart data
          const trendChartData = {
            labels: Object.keys(monthlyExpenses),
            values: Object.values(monthlyExpenses),
          };

          // Generate trend chart
          //@ts-ignore
          const trendChartBase64 = await generateBarChart(trendChartData);
          doc.addImage(
            `data:image/png;base64,${trendChartBase64}`,
            "PNG",
            30,
            labelYPos,
            150,
            80
          );

          doc.setFontSize(16);
          doc.setTextColor("#2E7D32");
          doc.setFont("helvetica", "bold");
          doc.text("Monthly Expense Trend", 14, labelYPos - 10);
        }

        yPos = Math.max(labelYPos + 90, 250);
      } else {
        yPos = Math.max(yPos + 20, 130);
      }

      // Add settlement summary
      const settlementSummary = await getSettlementSummary(groupId, start, end);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor("#F44336");
      doc.text(`Total Group Expenses:`, 14, yPos);
      doc.text(`-${totalExpenses.toFixed(2)}`, pageWidth - 14, yPos, {
        align: "right",
      });

      // Add settlement page if needed
      if (settlementSummary.length > 0) {
        doc.addPage();
        //@ts-ignore
        addHeaderWithLogo(doc.internal.getNumberOfPages());

        doc.setFontSize(16);
        doc.setTextColor("#2E7D32");
        doc.setFont("helvetica", "bold");
        doc.text("Settlement Summary", 14, 60);

        doc.setFontSize(12);
        doc.text("Recommended Settlements", 14, 75);

        // Create a settlement table
        autoTable(doc, {
          head: [["From", "To", "Amount"]],
          body: settlementSummary.map((s) => [
            s.fromUser,
            s.toUser,
            s.amount.toFixed(2),
          ]),
          startY: 80,
          margin: { top: 50 },
          styles: {
            fontSize: 10,
            cellPadding: 5,
            fillColor: [240, 248, 240],
          },
          headStyles: {
            fillColor: [46, 125, 50],
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [248, 255, 248],
          },
        });
      }

      // Add detailed expenses if requested
      if (isDetailed) {
        doc.addPage();
        //@ts-ignore
        addHeaderWithLogo(doc.internal.getNumberOfPages());
        doc.setFontSize(16);
        doc.setTextColor("#2E7D32");
        doc.text("Group Expenses", 14, 60);

        autoTable(doc, {
          head: [
            ["Date", "Category", "Amount", "Paid By", "Description", "Status"],
          ],
          body: groupExpenses.map((e) => [
            format(e.date, "dd-MM-yyyy"),
            e.category || "Uncategorized",
            `-${Number(e.amount).toFixed(2)}`,
            //@ts-ignore
            e.paidBy.name,
            e.description || "",
            e.status,
          ]),
          startY: 70,
          margin: { top: 50 },
          styles: {
            fontSize: 10,
            cellPadding: 5,
            fillColor: [240, 248, 240],
            textColor: [50, 50, 50],
          },
          headStyles: {
            fillColor: [46, 125, 50],
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [248, 255, 248],
          },
          didDrawPage: (data) => {
            //@ts-ignore
            addHeaderWithLogo(doc.internal.getNumberOfPages());
          },
        });

        if (includeMemberDetails) {
          doc.addPage();
          //@ts-ignore
          addHeaderWithLogo(doc.internal.getNumberOfPages());
          doc.setFontSize(16);
          doc.setTextColor("#1976D2");
          doc.text("Member Split Details", 14, 60);

          const splitData = groupExpenses.flatMap((expense) =>
            //@ts-ignore
            expense.splits.map((split) => ({
              date: format(expense.date, "dd-MM-yyyy"),
              description: expense.description || "",
              user: split.user.name,
              amount: Number(split.amount).toFixed(2),
              status: split.isPaid,
              paidAmount: split.payments
                //@ts-ignore
                .reduce((sum, p) => sum + Number(p.amount), 0)
                .toFixed(2),
            }))
          );

          autoTable(doc, {
            head: [
              [
                "Date",
                "Description",
                "Member",
                "Owed Amount",
                "Status",
                "Paid Amount",
              ],
            ],
            body: splitData.map((s) => [
              s.date,
              s.description,
              s.user,
              `-${s.amount}`,
              s.status,
              s.paidAmount,
            ]),
            startY: 70,
            margin: { top: 50 },
            styles: {
              fontSize: 10,
              cellPadding: 5,
              fillColor: [240, 248, 255],
            },
            headStyles: {
              fillColor: [25, 118, 210],
              textColor: 255,
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [248, 255, 248],
            },
            didDrawPage: (data) => {
              //@ts-ignore
              addHeaderWithLogo(doc.internal.getNumberOfPages());
            },
          });
        }
      }
    }

    reportBuffer = Buffer.from(doc.output("arraybuffer"));
    mimeType = "application/pdf";
    fileExtension = "pdf";
  } else if (reportFormat === "csv" || reportFormat === "excel") {
    const worksheetData = [
      ["Group Expense Report"],
      [`Group: ${groupMember.group.name}`],
      [
        `Period: ${format(start, "dd MMM yyyy")} - ${format(
          end,
          "dd MMM yyyy"
        )}`,
      ],
      [],
      ["Expenses"],
      ["Date", "Category", "Amount", "Paid By", "Description", "Status"],
      ...groupExpenses.map((e) => [
        format(e.date, "dd-MM-yyyy"),
        e.category || "Uncategorized",
        -Number(e.amount),
        // @ts-ignore
        e.paidBy.name,
        e.description || "",
        e.status,
      ]),
      [],
      [
        "Total Expenses",
        "",
        groupExpenses.reduce((sum, e) => sum + Number(e.amount), 0),
      ],
    ];

    if (includeMemberDetails) {
      worksheetData.push(
        [],
        ["Member Splits"],
        [
          "Date",
          "Description",
          "Member",
          "Owed Amount",
          "Status",
          "Paid Amount",
        ],
        ...groupExpenses.flatMap((e) =>
          // @ts-ignore
          e.splits.map((s) => [
            format(e.date, "dd-MM-yyyy"),
            e.description || "",
            s.user.name,
            -Number(s.amount),
            s.isPaid,
            // @ts-ignore
            s.payments.reduce((sum, p) => sum + Number(p.amount), 0),
          ])
        )
      );
    }

    if (groupExpenses.length === 0) {
      worksheetData.push([], ["No group expenses for the selected period."]);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Group Report");

    if (reportFormat === "csv") {
      reportBuffer = Buffer.from(
        XLSX.write(workbook, { type: "buffer", bookType: "csv" })
      );
      mimeType = "text/csv";
      fileExtension = "csv";
    } else {
      reportBuffer = Buffer.from(
        XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
      );
      mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      fileExtension = "xlsx";
    }
  } else {
    throw new Error("Invalid report format");
  }

  return {
    buffer: reportBuffer.toString("base64"),
    mimeType,
    fileExtension,
    name: groupMember.group.name,
  };
}

async function generatePieChart(data: ChartData): Promise<string> {
  const width = 400;
  const height = 300;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get 2D context from canvas");
  }

  const configuration = {
    type: "pie",
    data: {
      datasets: [
        {
          data: data.values,
          backgroundColor: [
            "#4CAF50",
            "#2196F3",
            "#FFC107",
            "#F44336",
            "#9C27B0",
            "#00BCD4",
            "#FF9800",
            "#795548",
            "#607D8B",
            "#E91E63",
            "#9E9E9E",
            "#FF5722",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        datalabels: { display: false },
      },
    },
  };

  //@ts-ignore
  const chart = new Chart(ctx, configuration);
  const imageBuffer = canvas.toBuffer("image/png");
  return imageBuffer.toString("base64");
}

async function getSettlementSummary(groupId: string, start: Date, end: Date) {
  // Get all members and their net balances
  const memberSplits = await db.expenseSplit.findMany({
    where: {
      expense: {
        groupId,
        date: {
          gte: start,
          lte: end,
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      expense: {
        select: {
          paidById: true,
          amount: true,
        },
      },
      payments: true,
    },
  });

  // Calculate net balances for each member
  const balances: Record<
    string,
    { userId: string; name: string; balance: number }
  > = {};

  memberSplits.forEach((split) => {
    const userId = split.userId;
    const userName = split.user.name;
    const paidById = split.expense.paidById;
    const totalAmount = Number(split.amount);
    const paidAmount = split.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
    const owedAmount = totalAmount - paidAmount;

    // Initialize member if not exists
    if (!balances[userId]) {
      balances[userId] = { userId, name: userName, balance: 0 };
    }

    // Add to member's balance (negative means they owe)
    balances[userId].balance -= owedAmount;

    // Add to payer's balance (positive means they are owed)
    if (!balances[paidById]) {
      const payer = memberSplits.find((s) => s.user.id === paidById);
      balances[paidById] = {
        userId: paidById,
        name: payer?.user.name || "Unknown",
        balance: 0,
      };
    }
    balances[paidById].balance += owedAmount;
  });

  // Create settlement plan
  const members = Object.values(balances);
  const settlements: { fromUser: string; toUser: string; amount: number }[] = [];

  // Debtors (negative balance)
  const debtors = members
    .filter((m) => m.balance < 0)
    .sort((a, b) => a.balance - b.balance);

  // Creditors (positive balance)
  const creditors = members
    .filter((m) => m.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  // Create optimal settlement plan
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    // Calculate transfer amount (minimum of what's owed and what's due)
    const amount = Math.min(Math.abs(debtor.balance), creditor.balance);

    if (amount > 0.01) {
      // Only add meaningful transfers
      settlements.push({
        fromUser: debtor.name,
        toUser: creditor.name,
        amount,
      });
    }

    // Update balances
    debtor.balance += amount;
    creditor.balance -= amount;

    // Move to next member if balance is (close to) zero
    if (Math.abs(debtor.balance) < 0.01) i++;
    if (Math.abs(creditor.balance) < 0.01) j++;
  }

  return settlements;
}