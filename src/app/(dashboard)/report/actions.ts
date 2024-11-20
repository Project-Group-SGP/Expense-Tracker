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
import { logo } from "@/lib/logo"
import { PDFDocument } from "pdf-lib";


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
      datasets: [
        {
          data: data.values,
          backgroundColor: [
            "#4CAF50",
            "#2196F3",
            "#FFC107",
            "#F44336",
            "#9C27B0",
            "#00BCD4",
            "#FF9800",
            "#795548",
            "#607D8B",
            "#E91E63",
            "#9E9E9E",
            "#FF5722",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        title: {
          display: false,
        },
        datalabels: {
          display: false,
        },
      },
    },
  }

  //@ts-ignore
  const chart = new Chart(ctx, configuration)
  const imageBuffer = canvas.toBuffer("image/png")
  return imageBuffer.toString("base64")
}

async function sendReportEmail(
  email: string,
  reportBuffer: Buffer,
  reportFormat: string,
  name: string
) {
  const fileExtensionMap: { [key: string]: string } = {
    pdf: "pdf",
    csv: "csv",
    excel: "xlsx",
  }

  const fileExtension = fileExtensionMap[reportFormat] || reportFormat

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
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your SpendWise Expense Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
          body {
            font-family: 'Roboto', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #ffffff;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 3px solid #4CAF50;
          }
          .logo-container {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
          }
          .logo {
            max-width: 100px;
            height: auto;
          }
          .logo-text {
            font-size: 32px;
            font-weight: bold;
            color: #2E7D32;
            margin: auto 0;
          }
          .content {
            padding: 30px;
            background-color: #ffffff;
          }
          h1 {
            color: #2E7D32;
            margin-top: 0;
            font-size: 24px;
            text-align: center;
          }
          .warning {
            background-color: #FFF3E0;
            border: 1px solid #FFB74D;
            border-radius: 4px;
            padding: 15px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .warning-icon {
            font-size: 24px;
          }
          .warning-text {
            color: #E65100;
            margin: 0;
          }
          .divider {
            height: 1px;
            background-color: #eaeaea;
            margin: 20px 0;
          }
          .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 0.9em;
            color: #666;
            border-top: 1px solid #eaeaea;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo-container">
              <img src="https://trackwithspendwise.vercel.app/SpendWIse-5.png" alt="SpendWise Logo" class="logo">
              <span class="logo-text">SpendWise</span>
            </div>
          </div>
          <div class="content">
            <h1>Your SpendWise Expense Report</h1>
            <p>Hello,${name},</p>
            <p>Thank you for using SpendWise to track your expenses. Your requested expense report is now ready and attached to this email.</p>
            <p>We encourage you to review the attached report for a detailed breakdown of your financial activity during this period.</p>
            <div class="warning">
              <span class="warning-icon" role="img" aria-label="Warning">⚠️</span>
              <p class="warning-text">This report contains sensitive financial information. Please do not share this report with anyone else.</p>
            </div>
            <div class="divider"></div>
            <p style="font-size: 14px; color: #666;">If you have any questions about this report or need help understanding your expenses, please don't hesitate to contact our support team.</p>
          </div>
          <div class="footer">
            <p>Need help? Contact us at etracker690@gmail.com</p>
            <p>&copy; 2023 SpendWise. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: `${name}_report.${fileExtension}`,
        content: reportBuffer,
      },
    ],
  };

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
): Promise<{
  buffer: string
  mimeType: string
  fileExtension: string
  name?: string
}> {
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
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height

    const addHeaderWithLogo = (pageNumber: number) => {
      const headerHeight = 40
      const margin = 10

      // Add a gradient background for the header
      const gradient = doc
        .setFillColor(230, 250, 230)
        .setDrawColor(76, 175, 80)
        .setLineWidth(1)
        .rect(0, 0, pageWidth, headerHeight, "FD")
      // // Add a thin border at the bottom of the header
      // doc
      //   .setDrawColor(76, 175, 80)
      //   .setLineWidth(0.5)
      //   .line(0, headerHeight, pageWidth, headerHeight)

      // Add logo
      const logoWidth = 20
      const logoHeight = 20
      doc.addImage(
        logo,
        "PNG",
        margin,
        (headerHeight - logoHeight) / 2,
        logoWidth,
        logoHeight
      )

      // Add "spendwise" text
      doc.setFontSize(24)
      doc.setTextColor(46, 125, 50)
      doc.setFont("helvetica", "bold")
      doc.text("spend", margin + 23, headerHeight / 2 + 2)
      doc.setTextColor(76, 175, 80)
      doc.text(
        "wise",
        margin + doc.getTextWidth("spend") + 23,
        headerHeight / 2 + 2
      )

      if (name && start && end) {
        doc.setFontSize(10)
        doc.setTextColor(60, 60, 60)
        doc.setFont("helvetica", "normal")

        // Align name to the right
        doc.text(`Name: ${name}`, pageWidth - margin, 15, { align: "right" })

        // Align period to the right, below the name
        const periodText = `Period: ${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`
        doc.text(periodText, pageWidth - margin, 25, { align: "right" })
      }

      // Add page number
      doc.setFontSize(8)
      doc.text(`Page ${pageNumber}`, pageWidth - margin, headerHeight - 5, {
        align: "right",
      })
    }

    // Add first page header
    addHeaderWithLogo(1)

    doc.setFontSize(20)
    doc.setTextColor("#2E7D32")
    doc.setFont("helvetica", "bold")
    doc.text("Expense Report", 14, 55)

    if (expenses.length === 0) {
      if (includeIncome && incomes.length > 0) {
        // Display income table
        doc.setFontSize(16)
        doc.setTextColor("#1976D2")
        doc.text("Income", 14, 80)
        autoTable(doc, {
          head: [["Date", "Amount", "Description"]],
          body: incomes.map((i) => [
            format(i.date, "dd-MM-yyyy"),
            `+${Number(i.amount).toFixed(2)}`,
            i.description || "",
          ]),
          startY: 90,
          margin: { top: 50 },
          styles: {
            fontSize: 10,
            cellPadding: 5,
            fillColor: [240, 248, 255],
            textColor: [50, 50, 50],
            lineColor: [100, 100, 100],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [25, 118, 210],
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [248, 255, 248],
          },
        })

        // Display total income
        const totalIncome = incomes.reduce(
          (sum, i) => sum + Number(i.amount),
          0
        )
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor("#1976D2")
        doc.text(
          `Total Income: +${totalIncome.toFixed(2)}`,
          14,
          (autoTable as any).previous(doc).finalY + 20
        )

        // Display "No expenses" message
        doc.setFontSize(12)
        doc.setFont("helvetica", "normal")
        doc.setTextColor("#F44336")
        doc.text(
          "No expenses recorded for the selected period.",
          14,
          (autoTable as any).previous(doc).finalY + 40
        )
      } else {
        // No income and no expenses
        doc.setFontSize(14)
        doc.setTextColor("#F44336")
        doc.text(
          "No expenses or income recorded for the selected period.",
          14,
          80
        )
      }
    } else {
      const totalExpenses = expenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      )
      let yPos = 0
      if (includeCharts) {
        const pieChartBase64 = await generatePieChart(pieChartData)
        doc.addImage(
          `data:image/png;base64,${pieChartBase64}`,
          "PNG",
          50,
          65,
          110,
          100
        )

        doc.setFontSize(16)
        doc.setTextColor("#2E7D32")
        doc.setFont("helvetica", "bold")
        doc.text("Expense Distribution", 14, 173)

        // Improve layout of category totals
        let leftCol = 20
        let rightCol = pageWidth / 2 + 10
        yPos = 183
        expensesByCategory.forEach((category, index) => {
          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(60, 60, 60)
          const text = `${category.category}: -${Number(category._sum.amount || 0).toFixed(2)}`
          // Define the size of the rectangle
          const rectWidth = 3
          const rectHeight = 3
          const rectX = index % 2 === 0 ? leftCol - 5 : rightCol - 5 // Adjust the X position to appear before the text
          const rectY = yPos - 3 // Adjust Y position to align with the text
          const colors: { [key: string]: string } = {
            Other: "#4CAF50",
            Bills: "#2196F3",
            Food: "#FFC107",
            Entertainment: "#F44336",
            Transportation: "#9C27B0",
            EMI: "#00BCD4",
            Healthcare: "#FF9800",
            Education: "#795548",
            Investment: "#607D8B",
            Shopping: "#E91E63",
            Fuel: "#9E9E9E",
            Groceries: "#FF5722",
          }
          doc.setFillColor(colors[category.category])
          // Draw the rectangle (no fill color yet, just a placeholder)
          doc.rect(rectX, rectY, rectWidth, rectHeight, "F")

          doc.text(
            `${text}  (${(((category._sum.amount as any) * 100) / totalExpenses).toFixed(2)})%`,
            index % 2 === 0 ? leftCol : rightCol,
            yPos
          )

          if (index % 2 !== 0) yPos += 8
        })
        yPos = Math.max(yPos + 20, 250)
      } else {
        yPos = 90
      }

      const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0)

      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.setTextColor("#F44336")
      doc.text(`Total Expense:`, 14, yPos - 12)
      doc.text(`-${totalExpenses.toFixed(2)}`, pageWidth - 14, yPos - 11, {
        align: "right",
      })
      yPos += 15
      if (includeIncome) {
        doc.setTextColor("#2E7D32")
        doc.text(`Total Income:`, 14, yPos - 12)
        doc.text(`+${totalIncome.toFixed(2)}`, pageWidth - 14, yPos - 11, {
          align: "right",
        })
        yPos += 15
        doc.setTextColor("#1976D2")
        doc.text(`Net:`, 14, yPos - 12)
        doc.text(
          `${(totalIncome - totalExpenses).toFixed(2)}`,
          pageWidth - 14,
          yPos - 11,
          { align: "right" }
        )
      }

      if (isDetailed) {
        doc.addPage()
        addHeaderWithLogo(2)
        doc.setFontSize(16)
        doc.setTextColor("#2E7D32")
        doc.text("Expenses", 14, 60)
        autoTable(doc, {
          head: [["Date", "Category", "Amount", "Description"]],
          body: expenses.map((e) => [
            format(e.date, "dd-MM-yyyy"),
            e.category,
            `-${Number(e.amount).toFixed(2)}`,
            e.description || "",
          ]),
          startY: 70,
          margin: { top: 50 },
          styles: {
            fontSize: 10,
            cellPadding: 5,
            fillColor: [240, 248, 240],
            textColor: [50, 50, 50],
            lineColor: [100, 100, 100],
            lineWidth: 0.1,
          },
          headStyles: {
            fillColor: [46, 125, 50],
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [248, 255, 248],
          },
          didDrawPage: function (data) {
            //@ts-ignore
            addHeaderWithLogo(doc.internal.getNumberOfPages())
          },
        })

        if (includeIncome && incomes.length > 0) {
          doc.addPage()
          //@ts-ignore
          addHeaderWithLogo(doc.internal.getNumberOfPages())
          doc.setFontSize(16)
          doc.setTextColor("#1976D2")
          doc.text("Income", 14, 60)
          autoTable(doc, {
            head: [["Date", "Amount", "Description"]],
            body: incomes.map((i) => [
              format(i.date, "dd-MM-yyyy"),
              `+${Number(i.amount).toFixed(2)}`,
              i.description || "",
            ]),
            startY: 70,
            margin: { top: 50 },
            styles: {
              fontSize: 10,
              cellPadding: 5,
              fillColor: [240, 248, 255],
              textColor: [50, 50, 50],
              lineColor: [100, 100, 100],
              lineWidth: 0.1,
            },
            headStyles: {
              fillColor: [25, 118, 210],
              textColor: 255,
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [248, 255, 248],
            },
            didDrawPage: function (data) {
              //@ts-ignore
              addHeaderWithLogo(doc.internal.getNumberOfPages())
            },
          })
        }
      }
    }

    // Update page numbers
    //@ts-ignore
    const totalPages = doc.internal.getNumberOfPages()
    // Inside the loop that updates page numbers
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)

      // Set font for footer text
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)

      // Add page numbers
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      })

      // Add generated date on the left
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        20,
        pageHeight - 10
      )

      doc.text(
        (process.env.BASE_URL as string).split("//")[1],
        pageWidth - 20,
        pageHeight - 10,
        {
          align: "right",
        }
      )
    }

    reportBuffer = Buffer.from(doc.output("arraybuffer"))
    mimeType = "application/pdf"
    fileExtension = "pdf"
  } else if (reportFormat === "csv" || reportFormat === "excel") {
    const worksheetData = [
      ["Expense Report"],
      [`Name: ${name}`],
      [
        `Period: ${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`,
      ],
      [],
      ["Expenses"],
      ["Date", "Category", "Amount", "Description"],
      ...expenses.map((e) => [
        format(e.date, "dd-MM-yyyy"),
        e.category,
        -Number(e.amount),
        e.description || "",
      ]),
      [],
      [
        "Total Expenses",
        "",
        expenses.reduce((sum, e) => sum + Number(e.amount), 0),
      ],
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
        ]),
        [],
        [
          "Total Income",
          "",
          incomes.reduce((sum, i) => sum + Number(i.amount), 0),
        ],
        [],
        [
          "Net",
          "",
          incomes.reduce((sum, i) => sum + Number(i.amount), 0) -
            expenses.reduce((sum, e) => sum + Number(e.amount), 0),
        ]
      )
    }

    if (expenses.length === 0 && incomes.length === 0) {
      worksheetData.push([], ["No data available for the selected period."])
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
    sendReportEmail(emailAddress, reportBuffer, reportFormat, name)
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
      name,
    }
  }
}
