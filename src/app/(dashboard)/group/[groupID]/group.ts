"use server"

import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { CategoryTypes } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"
import { revalidatePath } from "next/cache"
import webpush from "web-push"

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