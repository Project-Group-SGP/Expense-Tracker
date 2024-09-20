"use server"

import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import webpush from "web-push"

// Accept Join Request
export async function acceptJoinRequest(groupId: string, requestId: string) {
  console.log("Function called", groupId, requestId)
  try {
    const user = await currentUserServer()
    if (!user || !user.id) {
      return { success: false, message: "You need to be logged in." }
    }

    // Find the group and check if the user is the creator
    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { creatorId: true, name: true },
    })

    if (!group || group.creatorId !== user.id) {
      return {
        success: false,
        message: "You are not authorized to perform this action.",
      }
    }

    // Fetch the join request to get the user ID of the user requesting to join
    const joinRequest = await db.joinRequest.findUnique({
      where: { id: requestId },
      select: { userId: true, user: { select: { name: true } } },
    })

    if (!joinRequest) {
      return { success: false, message: "Join request not found." }
    }

    // Add user to the group and delete the join request
    await db.$transaction([
      db.groupMember.create({
        data: {
          userId: joinRequest.userId,
          groupId,
        },
      }),
      db.joinRequest.delete({
        where: { id: requestId },
      }),
    ])

    sendJoinAcceptedNotification(group.name, joinRequest.userId, groupId)

    sendJoinNotificationToGroupMembers(
      group.name,
      joinRequest.userId,
      groupId,
      joinRequest.user.name!
    )

    return { success: true, message: "Join request accepted." }
  } catch (error) {
    console.error("Error accepting join request:", error)
    return { success: false, message: "Something went wrong." }
  }
}

// Decline Join Request
export async function declineJoinRequest(groupId: string, requestId: string) {
  console.log("Function called", groupId, requestId)

  try {
    const user = await currentUserServer()
    if (!user || !user.id) {
      return { success: false, message: "You need to be logged in." }
    }

    // Find the group and check if the user is the creator
    const group = await db.group.findUnique({
      where: { id: groupId },
      select: { creatorId: true, name: true },
    })

    if (!group || group.creatorId !== user.id) {
      return {
        success: false,
        message: "You are not authorized to perform this action.",
      }
    }

    const userId = await db.joinRequest.findUnique({
      where: { id: requestId },
      select: { userId: true },
    })

    if (!userId) {
      return { success: false, message: "Join request not found." }
    }
    // Decline the join request by updating its status
    await db.joinRequest.delete({
      where: { id: requestId },
    })

    sendRejectNotification(group.name, userId.userId)
    return { success: true, message: "Join request declined." }
  } catch (error) {
    console.error("Error declining join request:", error)
    return { success: false, message: "Something went wrong." }
  }
}

async function sendRejectNotification(groupName: string, userId: string) {
  console.log(
    `Attempting to send notification for group ${groupName} and requester ${userId}`
  )
  try {
    const userSubscription = await db.pushSubscription.findMany({
      where: {
        userId: userId,
      },
    })

    if (!userSubscription) {
      console.log(`No valid subscriptions found for user ${userId} found`)
      return
    }

    const notificationPayload = JSON.stringify({
      title: "Rejected Join Request",
      body: `${groupName} has rejected your join request`,
      type: "reject-request",
    })

    const sendPromises = userSubscription.map(async (subscription) => {
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
          await db.pushSubscription.delete({
            where: { id: subscription.id },
          })
        }
      }
    })

    await Promise.all(sendPromises)
  } catch (error) {
    console.error("Error in sendJoinRequestNotification:", error)
  }
}

async function sendJoinAcceptedNotification(
  groupName: string,
  userId: string,
  groupId: string
) {
  console.log(
    `Attempting to send notification for group ${groupName} and requester ${userId}`
  )
  try {
    const userSubscription = await db.pushSubscription.findMany({
      where: {
        userId: userId,
      },
    })

    if (!userSubscription) {
      console.log(`No valid subscriptions found for user ${userId} found`)
      return
    }

    const notificationPayload = JSON.stringify({
      title: "Join Request Accepted",
      body: `${groupName} has accepted your join request`,
      type: "join-request",
      data: {
        url: `/group/${groupId}`,
      },
    })

    const sendPromises = userSubscription.map(async (subscription) => {
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

    await Promise.all(sendPromises)
  } catch (error) {
    console.error("Error in sendJoinRequestNotification:", error)
  }
}

async function sendJoinNotificationToGroupMembers(
  groupName: string,
  userId: string,
  groupId: string,
  userName: string
) {
  console.log(
    `Attempting to send notification for group ${groupName} and requester ${userId}`
  )
  try {
    const groupMembers = await db.groupMember.findMany({
      select: {
        userId: true,
      },
      where: {
        groupId: groupId,
      },
    })

    const userSubscription = await db.pushSubscription.findMany({
      where: {
        userId: {
          in: groupMembers
            .filter((member) => member.userId !== userId)
            .map((member) => member.userId),
        },
      },
    })

    if (!userSubscription) {
      console.log(`No valid subscriptions found for user ${userId} found`)
      return
    }

    const notificationPayload = JSON.stringify({
      title: "New Member",
      body: `${userName} has joined your group "${groupName}"`,
      type: "join-request",
      data: {
        url: `/group/${groupId}`,
      },
    })
    const sendPromises = userSubscription.map(async (subscription) => {
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

    await Promise.all(sendPromises)
  } catch (error) {
    console.error("Error in sendJoinRequestNotification:", error)
  }
}
