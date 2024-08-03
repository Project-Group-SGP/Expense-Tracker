"use server"

import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"
import { db } from "@/lib/db"
import { currentUserServer } from "@/lib/auth"
import jsPDF from "jspdf"
import "jspdf-autotable"
import autoTable from "jspdf-autotable"
import { createCanvas } from "canvas"
import { Chart, registerables } from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import nodemailer from "nodemailer"
import { CategoryTypes, Prisma } from "@prisma/client"
import * as XLSX from "xlsx"

Chart.register(...registerables, ChartDataLabels)

interface ChartData {
  labels: string[]
  values: number[]
}

async function generatePieChart(data: ChartData): Promise<string> {
  const width = 400
  const height = 300

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
          position: "right",
          labels: {
            boxWidth: 12,
            padding: 10,
          },
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const dataset = tooltipItem.dataset
              const total = dataset.data.reduce(
                (acc, data) => acc + Number(data),
                0
              )
              const value = Number(dataset.data[tooltipItem.dataIndex])
              const percentage = ((value / total) * 100).toFixed(1)
              return `${tooltipItem.label}: ${value.toFixed(2)} (${percentage}%)`
            },
          },
        },
        datalabels: {
          formatter: (value, ctx) => {
            const dataset = ctx.chart.data.datasets[0]
            const total = dataset.data.reduce(
              (acc, data) => acc + Number(data),
              0
            )
            const percentage = ((Number(value) / total) * 100).toFixed(1)
            return percentage + "%"
          },
          color: "#fff",
          font: {
            weight: "bold",
            size: 10,
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

// enum CategoryTypes {
//   Other = "Other",
//   Bills = "Bills",
//   Food = "Food",
//   Entertainment = "Entertainment",
//   Transportation = "Transportation",
//   EMI = "EMI",
//   Healthcare = "Healthcare",
//   Education = "Education",
//   Investment = "Investment",
//   Shopping = "Shopping",
//   Fuel = "Fuel",
//   Groceries = "Groceries",
// }

function addHeader(
  doc: jsPDF,
  title: string,
  name?: string,
  start?: Date,
  end?: Date
) {
  const headerHeight = 40
  const backgroundColor = "#4CAF50"
  const textColor = "#ffffff"

  doc.setFillColor(backgroundColor)
  doc.rect(0, 0, doc.internal.pageSize.width, headerHeight, "F")

  doc.setDrawColor(backgroundColor)
  doc.setLineWidth(2)
  doc.line(0, headerHeight, doc.internal.pageSize.width, headerHeight)

  doc.setFontSize(22)
  doc.setTextColor(textColor)
  doc.setFont("helvetica", "bold")
  doc.text("SpendWise", 14, headerHeight / 2 - 5)
  doc.setFontSize(18)
  doc.setFont("helvetica", "normal")
  doc.text(title, doc.internal.pageSize.width / 2, headerHeight / 2 + 5, {
    align: "center",
  })

  if (name && start && end) {
    doc.setFontSize(10)
    doc.text(
      `Name: ${name}`,
      doc.internal.pageSize.width - 14,
      headerHeight / 2 - 5,
      { align: "right" }
    )
    doc.text(
      `Period: ${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`,
      doc.internal.pageSize.width - 14,
      headerHeight / 2 + 5,
      { align: "right" }
    )
  }
}

function addFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
  const footerHeight = 25

  doc.setDrawColor("#4CAF50")
  doc.setLineWidth(1)
  doc.line(
    0,
    297 - footerHeight,
    doc.internal.pageSize.width,
    297 - footerHeight
  )

  doc.setFontSize(10)
  doc.setTextColor("#4CAF50")
  doc.text(`Page ${pageNumber} of ${totalPages}`, 105, 297 - footerHeight / 2, {
    align: "center",
  })
}

async function sendReportEmail(
  email: string,
  reportBuffer: Buffer,
  reportFormat: string,
  name: string
) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your SpendWise Expense Report",
    html: `
      <h1>Your SpendWise Expense Report</h1>
      <p>Please find your requested expense report attached.</p>
    `,
    attachments: [
      {
        filename: `${name}_report.${reportFormat}`,
        content: reportBuffer,
      },
    ],
  }

  await transporter.sendMail(mailOptions)
}

export async function generateReport(
  reportType: string,
  startDate?: Date,
  endDate?: Date,
  reportFormat: string = "pdf",
  includeCharts: boolean = true,
  isDetailed: boolean = false,
  selectedCategories: CategoryTypes[] = [],
  includeIncome: boolean = false,
  emailReport: boolean = false,
  emailAddress?: string
): Promise<{ buffer: string; mimeType: string; fileExtension: string }> {
  const user = await currentUserServer()
  if (!user) {
    throw new Error("Login Please")
  }
  const { name, id } = user
  let start: Date, end: Date

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

  const expenseQuery: Prisma.ExpenseFindManyArgs = {
    where: {
      userId: id,
      date: {
        gte: start,
        lte: end,
      },
      ...(selectedCategories.length > 0 && {
        category: { in: selectedCategories as CategoryTypes[] },
      }),
    },
    orderBy: {
      date: "asc",
    },
  }

  const expensesByCategory = await db.expense.groupBy({
    by: ["category"],
    where: {
      userId: id,
      date: {
        gte: start,
        lte: end,
      },
      ...(selectedCategories.length > 0 && {
        category: { in: selectedCategories as CategoryTypes[] },
      }),
    },
    _sum: {
      amount: true,
    },
  })

  const expenses = await db.expense.findMany(expenseQuery)

  const incomes = includeIncome
    ? await db.income.findMany({
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
    : []

  const pieChartData: ChartData = {
    labels: Object.values(CategoryTypes).filter(
      (cat) =>
        selectedCategories.length === 0 ||
        selectedCategories.includes(cat as CategoryTypes)
    ),
    values: Object.values(CategoryTypes)
      .filter(
        (cat) =>
          selectedCategories.length === 0 ||
          selectedCategories.includes(cat as CategoryTypes)
      )
      .map((cat) =>
        Number(
          expensesByCategory.find((exp) => exp.category === cat)?._sum
            ?.amount || 0
        )
      ),
  }

  let reportBuffer: Buffer
  let mimeType: string
  let fileExtension: string

  if (reportFormat === "pdf") {
    const doc = new jsPDF()

    addHeader(doc, "Expense Report", name, start, end)

    if (includeCharts) {
      const pieChartBase64 = await generatePieChart(pieChartData)
      doc.addImage(
        `data:image/png;base64,${pieChartBase64}`,
        "PNG",
        14,
        70,
        90,
        70
      )

      doc.setFontSize(16)
      doc.setTextColor("#4CAF50")
      doc.setFont("helvetica", "bold")
      doc.text("Expense Distribution", 14, 65)

      let yPos = 70
      expensesByCategory.forEach((category) => {
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(
          `${category.category}: -${Number(category._sum.amount || 0).toFixed(2)}`,
          110,
          yPos
        )
        yPos += 7
      })
    }

    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0)

    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text(`Total Expenses: -${totalExpenses.toFixed(2)}`, 14, 160)
    if (includeIncome) {
      doc.text(`Total Income: +${totalIncome.toFixed(2)}`, 14, 170)
      doc.text(`Net: ${(totalIncome - totalExpenses).toFixed(2)}`, 14, 180)
    }

    if (isDetailed) {
      doc.addPage()
      addHeader(doc, "Expense Report")
      doc.setFontSize(14)
      doc.setTextColor("#4CAF50")
      doc.text("Expenses", 14, 50)
      autoTable(doc, {
        head: [["Date", "Category", "Amount", "Description"]],
        body: expenses.map((e) => [
          format(e.date, "dd-MM-yyyy"),
          e.category,
          `-${Number(e.amount).toFixed(2)}`,
          e.description || "",
        ]),
        startY: 60,
        margin: { top: 50 },
        styles: {
          fillColor: [240, 248, 240],
          textColor: 20,
          lineColor: [0, 100, 0],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [76, 175, 80],
          textColor: 255,
          lineColor: [0, 100, 0],
          lineWidth: 0.1,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 255, 248],
        },
      })

      if (includeIncome) {
        doc.addPage()
        addHeader(doc, "Expense Report")
        doc.setFontSize(14)
        doc.setTextColor("#4CAF50")
        doc.text("Income", 14, 50)
        autoTable(doc, {
          head: [["Date", "Amount", "Description"]],
          body: incomes.map((i) => [
            format(i.date, "dd-MM-yyyy"),
            `+${Number(i.amount).toFixed(2)}`,
            i.description || "",
          ]),
          startY: 60,
          margin: { top: 50 },
          styles: {
            fillColor: [240, 248, 240],
            textColor: 20,
            lineColor: [0, 100, 0],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [76, 175, 80],
            textColor: 255,
            lineColor: [0, 100, 0],
            lineWidth: 0.1,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [248, 255, 248],
          },
        })
      }
    }

    //@ts-ignore
    const totalPages = doc.internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      addFooter(doc, i, totalPages)
    }

    reportBuffer = Buffer.from(doc.output("arraybuffer"))
    mimeType = "application/pdf"
    fileExtension = "pdf"
  } else if (reportFormat === "csv" || reportFormat === "excel") {
    const worksheetData = [
      ["Date", "Category", "Amount", "Description"],
      ...expenses.map((e) => [
        format(e.date, "dd-MM-yyyy"),
        e.category,
        -Number(e.amount),
        e.description || "",
      ]),
    ]

    if (includeIncome) {
      worksheetData.push(
        [],
        ["Income"],
        ["Date", "Amount", "Description"],
        ...incomes.map((i) => [
          format(i.date, "dd-MM-yyyy"),
          Number(i.amount),
          i.description || "",
        ])
      )
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expense Report")

    if (reportFormat === "csv") {
      reportBuffer = Buffer.from(
        XLSX.write(workbook, { type: "buffer", bookType: "csv" })
      )
      mimeType = "text/csv"
      fileExtension = "csv"
    } else {
      reportBuffer = Buffer.from(
        XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
      )
      mimeType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      fileExtension = "xlsx"
    }
  } else {
    throw new Error("Invalid report format")
  }

  if (emailReport && emailAddress) {
    await sendReportEmail(emailAddress, reportBuffer, reportFormat, name)
    return {
      buffer: "Report sent to your email successfully!",
      mimeType: "",
      fileExtension: "",
    }
  } else {
    return {
      buffer: reportBuffer.toString("base64"),
      mimeType,
      fileExtension,
    }
  }
}
