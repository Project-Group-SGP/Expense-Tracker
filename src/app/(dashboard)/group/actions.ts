"use server"
import { db } from "@/lib/db"
import { currentUserServer } from "@/lib/auth"
import webpush, { WebPushError } from "web-push"

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
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
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

async function sendJoinRequestNotification(
  groupId: string,
  requesterId: string
) {
  console.log(
    `Attempting to send notification for group ${groupId} and requester ${requesterId}`
  )
  try {
    const group = await db.group.findUnique({
      where: { id: groupId },
      include: { creator: { include: { pushSubscriptions: true } } },
    })

    const requester = await db.user.findUnique({
      where: { id: requesterId },
      select: { name: true },
    })

    if (!group || !group.creator.pushSubscriptions.length || !requester) {
      console.log(
        `No valid subscriptions found for group ${groupId} or requester not found`
      )
      return
    }

    const notificationPayload = JSON.stringify({
      title: "New Join Request",
      body: `${requester.name} has requested to join your group "${group.name}"`,
      type: "join-request",
      data: {
        url: `/group/${groupId}/requests`,
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
          return { success: true, subscription }
        } catch (error: any) {
          if (error.statusCode === 410) {
            console.log(
              `Subscription expired for endpoint: ${subscription.endpoint}`
            )
            await db.pushSubscription.delete({ where: { id: subscription.id } })
            return { success: false, subscription, reason: "expired" }
          }
          return { success: false, subscription, reason: "error", error }
        }
      }
    )

    const results = await Promise.all(sendPromises)
    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    console.log(
      `Push notifications sent. Success: ${successCount}, Failures: ${failureCount}`
    )

    if (failureCount > 0) {
      console.log(
        "Failed notifications:",
        results.filter((r) => !r.success)
      )
    }
  } catch (error) {
    console.error("Error in sendJoinRequestNotification:", error)
  }
}

// Join Group
export async function joinGroup(code: string) {
  try {
    const user = await currentUserServer()

    //Check For Login
    if (!user || !user.id) {
      return { success: false, message: "User not authenticated" }
    }

    //Check for validity of the code
    if (code.length !== 6 || !code.match(/^[a-zA-Z0-9]+$/)) {
      return { success: false, message: "Invalid group code" }
    }

    const group = await db.group.findUnique({
      where: { code },
      include: { members: true, joinRequests: true },
    })

    //If no such group is found
    if (!group) {
      return { success: false, message: "Group not found" }
    }

    //Check if user is already a member
    const isMember = group.members.some((member) => member.userId === user.id)
    if (isMember) {
      return {
        success: false,
        message: "You are already a member of this group",
      }
    }

    //Check if user has a pending request to thais group
    const hasPendingRequest = group.joinRequests.some(
      (request) => request.userId === user.id && request.status === "PENDING"
    )
    if (hasPendingRequest) {
      return {
        success: false,
        message: "You already have a pending request for this group",
      }
    }

    await db.joinRequest.create({
      data: {
        userId: user.id,
        groupId: group.id,
        status: "PENDING",
      },
    })

    await sendJoinRequestNotification(group.id, user.id)

    return { success: true, message: "Join request sent successfully" }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to join group",
    }
  }
}
