"use server"

import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"
import { db } from "@/lib/db"
import { currentUserServer } from "@/lib/auth"
import jsPDF from "jspdf"
import "jspdf-autotable"
import autoTable from "jspdf-autotable"
import { createCanvas } from "canvas"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface ChartData {
  labels: string[]
  values: number[]
}

async function generatePieChart(data: ChartData): Promise<string> {
  const width = 800 // Width of the chart
  const height = 400 // Height of the chart

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Failed to get 2D context from canvas")
  }

  const configuration = {
    type: "pie",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF9F40",
            "#A3E6B3",
            "#FFC3A0",
            "#A5A8A5",
            "#9F99C4",
            "#8C9C8C",
            "#D6E1E0",
            "#B8C9A7",
            "#C7A7A1",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `${tooltipItem.label}: ${tooltipItem.raw}`
            },
          },
        },
      },
    },
  }

  //@ts-ignore
  const chart = new Chart(ctx, configuration)
  const imageBuffer = canvas.toBuffer("image/png")
  return imageBuffer.toString("base64")
}

enum CategoryTypes {
  Other = "Other",
  Bills = "Bills",
  Food = "Food",
  Entertainment = "Entertainment",
  Transportation = "Transportation",
  EMI = "EMI",
  Healthcare = "Healthcare",
  Education = "Education",
  Investment = "Investment",
  Shopping = "Shopping",
  Fuel = "Fuel",
  Groceries = "Groceries",
}

function addHeader(
  doc: jsPDF,
  title: string,
  name?: string,
  start?: Date,
  end?: Date
) {
  const headerHeight = 35
  const backgroundColor = "#008000"
  const textColor = "#ffffff"

  doc.setFillColor(backgroundColor)
  doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, "F")

  doc.setDrawColor(0)
  doc.setLineWidth(0.5)
  doc.line(0, headerHeight, doc.internal.pageSize.width, headerHeight)

  doc.setFontSize(18)
  doc.setTextColor(textColor)
  doc.text("SpendWise", 14, headerHeight / 2)
  doc.text(title, doc.internal.pageSize.width / 2, headerHeight / 2, {
    align: "center",
  })

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

  doc.setDrawColor(0)
  doc.setLineWidth(0.5)
  doc.line(
    0,
    297 - footerHeight,
    doc.internal.pageSize.width,
    297 - footerHeight
  )

  doc.setFontSize(10)
  doc.setTextColor("#008000")
  doc.text(`Page ${pageNumber} of ${totalPages}`, 105, 297 - footerHeight / 2, {
    align: "center",
  })
}

export async function generateReport(
  reportType: string,
  startDate?: Date,
  endDate?: Date
): Promise<string> {
  const user = await currentUserServer()
  if (!user) {
    throw new Error("Login Please")
  }
  const { name, id } = user
  let start: Date, end: Date
  const headerHeight = 50

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
      if (!startDate || !endDate) {
        throw new Error("Custom date range requires start and end dates")
      }
      start = startDate
      end = endDate
      break
    default:
      throw new Error("Invalid report type")
  }

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

  const pieChartData: ChartData = {
    labels: Object.values(CategoryTypes),
    //@ts-ignore
    values: Object.values(CategoryTypes).map(
      (cat) =>
        expensesByCategory.find((exp) => exp.category === cat)?._sum.amount || 0
    ),
  }

  const pieChartBase64 = await generatePieChart(pieChartData)

  const doc = new jsPDF()

  addHeader(doc, "Expense Report", name, start, end)
  doc.addImage(
    `data:image/png;base64,${pieChartBase64}`,
    "PNG",
    14,
    60,
    180,
    100
  )

  doc.setFontSize(14)
  doc.setTextColor("#004d00")
  doc.text("Expense Distribution", 14, 180)
  let yPos = 190
  expensesByCategory.forEach((category) => {
    doc.setFontSize(10)
    doc.text(
      `${category.category}: ${category._sum.amount?.toFixed(2) || "0.00"}`,
      14,
      yPos
    )
    yPos += 7
  })

  doc.addPage()
  addHeader(doc, "Expense Report")
  doc.setFontSize(14)
  doc.setTextColor("#004d00")
  doc.text("Expenses", 14, headerHeight + 10)
  autoTable(doc, {
    head: [["Date", "Category", "Amount", "Description"]],
    body: expenses.map((e) => [
      format(e.date, "dd-MM-yyyy"),
      e.category,
      e.amount.toFixed(2),
      e.description || "",
    ]),
    startY: headerHeight + 20,
    margin: { top: 50 },
    styles: {
      fillColor: [220, 255, 220],
      textColor: 0,
      lineColor: 0,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [200, 255, 200],
      textColor: 0,
      lineColor: 0,
      lineWidth: 0.1,
    },
  })

  doc.addPage()
  addHeader(doc, "Expense Report")
  doc.setFontSize(14)
  doc.setTextColor("#004d00")
  doc.text("Income", 14, headerHeight + 10)
  autoTable(doc, {
    head: [["Date", "Amount", "Description"]],
    body: incomes.map((i) => [
      format(i.date, "dd-MM-yyyy"),
      i.amount.toFixed(2),
      i.description || "",
    ]),
    startY: headerHeight + 20,
    margin: { top: 50 },
    styles: {
      fillColor: [220, 255, 220],
      textColor: 0,
      lineColor: 0,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [200, 255, 200],
      textColor: 0,
      lineColor: 0,
      lineWidth: 0.1,
    },
  })

  //@ts-ignore
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addFooter(doc, i, totalPages)
  }

  const pdfBuffer = doc.output("arraybuffer")
  return Buffer.from(pdfBuffer).toString("base64")
}
