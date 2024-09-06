import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  try {
    const user = await currentUserServer();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const group = await db.group.findUnique({
      where: { id: user.id }, 
    });

    if (!group) {
      return new Response("Group not found", { status: 404 });
    }

    // Get group members
    const groupMembers = await db.groupMember.findMany({
      where: { groupId: group.id },
    });

    // Get group members' names and avatars
    const groupMemberDetails = await Promise.all(
      groupMembers.map(async (member) => {
        const userDetails = await db.user.findUnique({
          where: { id: member.userId },
          select: { name: true, image: true },
        });
        return {
          userId: member.userId,
          name: userDetails?.name || "Unknown",
          avatar: userDetails?.image || "",
        };
      })
    );

    // Get pending payments
    const getPendingPayments = async (userId: string, groupId: string) => {
      return await db.expenseSplit.findMany({
        where: {
          userId,
          expense: { groupId },
          isPaid: "UNPAID",
        },
        select: {
          amount: true,
          expense: { select: { paidBy: { select: { id: true, name: true } } } },
          payments: { select: { amount: true } },
        },
      });
    };

    // Function to get users to whom the current user needs to pay
    const getUsersToPay = async (userId: string, groupId: string) => {
      const expenseSplits = await db.expenseSplit.findMany({
        where: {
          userId, // Get splits related to the current user
          expense: { groupId },
          isPaid: { in: ["UNPAID", "PARTIALLY_PAID"] },
        },
        select: {
          amount: true,
          expense: {
            select: {
              paidBy: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          payments: { select: { amount: true } },
        },
      });

      // Calculate the amount the current user needs to pay
      return expenseSplits
        .map((split) => {
          const totalPayments = split.payments.reduce(
            (acc, payment) => acc + payment.amount.toNumber(),
            0
          );
          return {
            memberName: split.expense.paidBy.name,
            memberId: split.expense.paidBy.id,
            amountToPay: split.amount.toNumber() - totalPayments,
          };
        })
        .filter((payment) => payment.amountToPay > 0 && payment.memberId !== userId);
    };

    const pendingPayments = await getPendingPayments(user.id, group.id);
    const usersToPay = await getUsersToPay(user.id, group.id);

    return NextResponse.json({
      group,
      groupMembers: groupMemberDetails,
      pendingPayments,
      usersToPay, // Include usersToPay in the response
    });
  } catch (error) {
    console.error("Error in GET function:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
