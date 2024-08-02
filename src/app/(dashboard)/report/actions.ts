"use server"

import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"
import { db } from "@/lib/db"
import { currentUserServer } from "@/lib/auth"
import jsPDF from "jspdf"
import "jspdf-autotable"
import autoTable from "jspdf-autotable"

function addHeader(
  doc: jsPDF,
  title: string,
  name?: string,
  start?: Date,
  end?: Date
) {
  const headerHeight = 35 // Increase the header height
  const backgroundColor = "#008000" // Lighter green background color
  const textColor = "#ffffff" // White text color

  // Draw the background rectangle
  doc.setFillColor(backgroundColor)
  doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, "F")

  // Add a thin line below the header
  doc.setDrawColor(0)
  doc.setLineWidth(0.5)
  doc.line(0, headerHeight, doc.internal.pageSize.width, headerHeight)

  // Add header text
  doc.setFontSize(18)
  doc.setTextColor(textColor)
  doc.text("SpendWise", 14, headerHeight / 2) // Company name on the left
  doc.text(title, doc.internal.pageSize.width / 2, headerHeight / 2, {
    align: "center",
  }) // Title centered

  if (name && start && end) {
    doc.setFontSize(12)
    doc.text(
      `Name: ${name}`,
      doc.internal.pageSize.width - 14,
      headerHeight / 2,
      {
        align: "right",
      }
    )
    doc.text(
      `Period: ${format(start, "dd-MM-yyyy")} - ${format(end, "dd-MM-yyyy")}`,
      doc.internal.pageSize.width - 14,
      headerHeight / 2 + 7,
      { align: "right" }
    )
  }
}

function addFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
  const footerHeight = 30

  // Add a thin line above the footer
  doc.setDrawColor(0)
  doc.setLineWidth(0.5)
  doc.line(
    0,
    297 - footerHeight,
    doc.internal.pageSize.width,
    297 - footerHeight
  )

  doc.setFontSize(10)
  doc.setTextColor("#008000") // Lighter green color for footer
  doc.text(`Page ${pageNumber} of ${totalPages}`, 105, 297 - footerHeight / 2, {
    align: "center",
  })
}

export async function generateReport(
  reportType: string,
  startDate?: Date,
  endDate?: Date
) {
  const user = await currentUserServer()
  if (!user) {
    throw new Error("Login Please")
  }
  const { name, id } = user
  let start: Date, end: Date
  const headerHeight = 50 // Define headerHeight here

  switch (reportType) {
    case "last_month":
      start = startOfMonth(subMonths(new Date(), 1))
      end = endOfMonth(subMonths(new Date(), 1))
      break
    case "last_3_months":
      start = startOfMonth(subMonths(new Date(), 3))
      end = endOfMonth(new Date())
      break
    case "last_6_months":
      start = startOfMonth(subMonths(new Date(), 6))
      end = endOfMonth(new Date())
      break
    case "custom":
      if (!startDate || !endDate)
        throw new Error("Custom date range requires start and end dates")
      start = startDate
      end = endDate
      break
    default:
      throw new Error("Invalid report type")
  }

  // Fetch expenses grouped by category
  const expensesByCategory = await db.expense.groupBy({
    by: ["category"],
    _sum: {
      amount: true,
    },
    where: {
      userId: id,
      date: {
        gte: start,
        lte: end,
      },
    },
  })

  // Fetch all expenses
  const expenses = await db.expense.findMany({
    where: {
      userId: id,
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  // Fetch all incomes
  const incomes = await db.income.findMany({
    where: {
      userId: id,
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  // Generate PDF
  const doc = new jsPDF()

  // Add header to the first page
  addHeader(doc, "Expense Report", name, start, end)

  // Add expense distribution
  doc.setFontSize(14)
  doc.setTextColor("#004d00") // Green color for text
  doc.text("Expense Distribution", 14, 60)
  let yPos = 70
  expensesByCategory.forEach((category) => {
    doc.setFontSize(10)
    doc.text(
      `${category.category}: ${category._sum.amount?.toFixed(2) || "0.00"}`,
      14,
      yPos
    )
    yPos += 7
  })

  // Add page and header for expenses table
  doc.addPage()
  addHeader(doc, "Expense Report")
  doc.setFontSize(14)
  doc.setTextColor("#004d00") // Green color for text
  doc.text("Expenses", 14, headerHeight + 10) // Start the text below the header
  autoTable(doc, {
    head: [["Date", "Category", "Amount", "Description"]],
    body: expenses.map((e) => [
      format(e.date, "dd-MM-yyyy"), // Use the "dd-MM-yyyy" date format
      e.category,
      e.amount.toFixed(2),
      e.description || "",
    ]),
    startY: headerHeight + 20, // Start the table below the header
    margin: { top: 50 }, // Add more top margin
    styles: {
      fillColor: [220, 255, 220], // Light green background color for header row
      textColor: 0, // Black text color
      lineColor: 0, // Black border color
      lineWidth: 0.1, // Thin border
    },
    headStyles: {
      fillColor: [200, 255, 200], // Lighter green background color for header row
      textColor: 0, // Black text color
      lineColor: 0, // Black border color
      lineWidth: 0.1, // Thin border
    },
  })

  // Add page and header for income table
  doc.addPage()
  addHeader(doc, "Expense Report")
  doc.setFontSize(14)
  doc.setTextColor("#004d00") // Green color for text
  doc.text("Income", 14, headerHeight + 10) // Start the text below the header
  autoTable(doc, {
    head: [["Date", "Amount", "Description"]],
    body: incomes.map((i) => [
      format(i.date, "dd-MM-yyyy"), // Use the "dd-MM-yyyy" date format
      i.amount.toFixed(2),
      i.description || "",
    ]),
    startY: headerHeight + 20, // Start the table below the header
    margin: { top: 50 }, // Add more top margin
    styles: {
      fillColor: [220, 255, 220], // Light green background color for header row
      textColor: 0, // Black text color
      lineColor: 0, // Black border color
      lineWidth: 0.1, // Thin border
    },
    headStyles: {
      fillColor: [200, 255, 200], // Lighter green background color for header row
      textColor: 0, // Black text color
      lineColor: 0, // Black border color
      lineWidth: 0.1, // Thin border
    },
  })

  // Add footer
  //@ts-ignore
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addFooter(doc, i, totalPages)
  }

  // Generate PDF buffer
  const pdfBuffer = doc.output("arraybuffer")

  // Return the PDF as a base64 encoded string
  return Buffer.from(pdfBuffer).toString("base64")
}
