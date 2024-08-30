"use server"
import { db } from "@/lib/db"
import { currentUserServer } from "@/lib/auth"
import { revalidatePath } from "next/cache"

interface AddGroupData {
  name: string
  description: string
}

interface AddGroupResult {
  success: boolean
  code?: string
  error?: string
}

async function generateUniqueCode(length: number = 6): Promise<string> {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code: string

  while (true) {
    code = Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("")

    // Check if the code already exists in the database
    const existingGroup = await db.group.findUnique({
      where: { code },
    })

    if (!existingGroup) {
      return code
    }
  }
}

export async function AddnewGroup({
  data,
}: {
  data: AddGroupData
}): Promise<AddGroupResult> {
  console.log("Function called", data)
  try {
    const user = await currentUserServer()

    if (!user || !user.id) {
      return { success: false, error: "User not authenticated" }
    }

    const code = await generateUniqueCode()

    const newGroup = await db.group.create({
      data: {
        name: data.name,
        description: data.description,
        code: code,
        creatorId: user.id,
        members: {
          create: {
            userId: user.id,
          },
        },
      },
    })

    return { success: true, code: newGroup.code }
  } catch (error) {
    console.error("Error creating group:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create group",
    }
  }
}
