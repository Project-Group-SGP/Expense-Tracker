import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const user = await currentUserServer();
    if (!user) {
        throw new Error("Login Please");
    }

    const budget = await db.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            budget: true,
        },
    });

    revalidateTag("budget-data");
    return new NextResponse(JSON.stringify(budget));
}