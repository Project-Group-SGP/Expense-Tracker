import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { PushSubscription } from "web-push"
export async function POST(req: Request) {
  try {
    const newSubscription: PushSubscription | undefined = await req.json()
    if (!newSubscription) {
      return NextResponse.json(
        { error: "Missing subscription in body" },
        { status: 400 }
      )
    }
    console.log("Subscription to add: ", newSubscription)

    const user = await currentUserServer()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized!!" }, { status: 401 })
    }

    const existingSubscription = await db.pushSubscription.findUnique({
      where: {
        endpoint: newSubscription.endpoint,
      },
    })

    if (existingSubscription) {
      await db.pushSubscription.update({
        where: {
          id: existingSubscription.id,
        },
        data: {
          auth: newSubscription.keys.auth,
          p256dh: newSubscription.keys.p256dh,
        },
      })
    } else {
      await db.pushSubscription.create({
        data: {
          userId: user.id,
          endpoint: newSubscription.endpoint,
          auth: newSubscription.keys.auth,
          p256dh: newSubscription.keys.p256dh,
        },
      })
    }

    return NextResponse.json(
      { message: "Subscription added successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in registerPush:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const subscriptionToDelete: PushSubscription | undefined = await req.json()
    if (!subscriptionToDelete) {
      return NextResponse.json(
        { error: "Missing subscription in body" },
        { status: 400 }
      )
    }

    console.log("Subscription to delete: ", subscriptionToDelete)

    const user = await currentUserServer()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized!!" }, { status: 401 })
    }

    const existingSubscription = await db.pushSubscription.findUnique({
      where: {
        endpoint: subscriptionToDelete.endpoint,
      },
    })

    if (!existingSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    if (existingSubscription.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this subscription" },
        { status: 403 }
      )
    }

    await db.pushSubscription.delete({
      where: {
        id: existingSubscription.id,
      },
    })

    return NextResponse.json(
      { message: "Subscription deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error in deletePush:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
