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

// add settle up
export async function settleUp(params: {
    groupID: string,
    userId: string,
    amount: number
}){

    const user = await currentUserServer();
    if (!user) {    
        throw new Error("Login Please");
    }

    const groupMembers = await db.groupMember.findMany({
        where: {
            groupId: params.groupID 
        }
    });

    // Check if the user is a member of the group
    if (groupMembers.some(member => member.id.toString() == params.userId.toString())) {
        throw new Error("User is not a member of the group");
    }

    // Create the settle up record
}
