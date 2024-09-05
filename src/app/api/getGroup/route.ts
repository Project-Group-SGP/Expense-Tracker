import { currentUserServer } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Not required
export async function GET(request: Request) {
    try {
      const user = await currentUserServer();
      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      } else {
        const group = await db.group.findUnique({
          where: {
            id: user.id,
          },
        });
        return NextResponse.json(group);
      }
    } catch (error) {    
      console.error("Error in GET function:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });    
    }
  }