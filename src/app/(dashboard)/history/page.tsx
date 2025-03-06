"use server"
import { currentUserServer } from "@/lib/auth"
import { format, parseISO } from "date-fns"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import HistoryPage from "./_components/History_page"

const getTransactionData = cache(
  async (cookie: string, from: string, to: string) => {
    try {
      const res = await fetch(
        `${process.env.BASE_URL}/api/history/bulkdata?from=${from}&to=${to}`,
        {
          method: "GET",
          headers: { Cookie: cookie },
          next: { tags: ["getTransactions"] },
          cache: "force-cache",
        }
      )

      if (!res.ok) throw new Error("Failed to fetch all transaction data")

      const { transactions } = await res.json()
      // console.log("Fetched transactions count:", transactions.length)
      return transactions
    } catch (error) {
      // console.error("Error fetching transaction data:", error)
      return []
    }
  }
)

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) => {
  const headersList = headers()
  const cookie = headersList.get("cookie") || ""
  const user = await currentUserServer()

  const from = searchParams?.from || ""
  const to = searchParams?.to || ""

  if (from === "" && to === "") {
    if (user && user.joininDate) {
      const joininDate = parseISO(user.joininDate)
      const formattedStartDate = format(joininDate, "yyyy-MM-dd")
      const formattedEndDate = format(new Date(), "yyyy-MM-dd")
      // router.push(`?from=${formattedStartDate}&to=${formattedEndDate}`, {
      //   scroll: false,
      // })
      redirect(`?from=${formattedStartDate}&to=${formattedEndDate}`)
    } else {
      return <div>Please log in to view your Transaction History.</div>
    }
  }

  const [Data] = await Promise.all([getTransactionData(cookie, from, to)])

  return <HistoryPage Data={Data} />
}

export default Page
