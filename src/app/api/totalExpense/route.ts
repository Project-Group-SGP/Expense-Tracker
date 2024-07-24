import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await currentUserServer();
    if (!user) {
        return NextResponse.json({ error: "User Not Found" }, { status: 401 });
    }
    const amount = await db.expense.aggregate({
        _sum: { amount: true },
        where: { userId: user?.id },
    })
    
    return NextResponse.json(amount._sum.amount?.toNumber() ?? 0);
}