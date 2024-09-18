"use server"
import { currentUserServer } from "@/lib/auth"
import { db } from "@/lib/db"
import { logo } from "@/lib/logo"
import { CategoryTypes, Prisma } from "@prisma/client"
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns"
import jsPDF from "jspdf"
import "jspdf-autotable"
import autoTable from "jspdf-autotable"
import nodemailer from "nodemailer"
import puppeteer, { Browser, PuppeteerLaunchOptions } from "puppeteer"
import * as XLSX from "xlsx"

interface ChartData {
  labels: string[]
  values: number[]
}

async function generatePieChartWithPuppeteer(data: ChartData): Promise<string> {
  let browser: Browser | undefined
  try {
    const isDevelopment = process.env.NODE_ENV === "development"

    // Define launch options for Puppeteer
    const launchOptions: PuppeteerLaunchOptions = {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    }

    // Launch Puppeteer
    browser = await puppeteer.launch(launchOptions)

    const page = await browser.newPage()

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!-- Load Chart.js -->
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.0.0"></script>
        </head>
        <body>
          <canvas id="myChart" width="400" height="300"></canvas>
          <script>
            Chart.register(ChartDataLabels);
            const ctx = document.getElementById('myChart').getContext('2d');
            new Chart(ctx, {
              type: 'pie',
              data: {
                labels: ${JSON.stringify(data.labels)},
                datasets: [{
                  data: ${JSON.stringify(data.values)},
                  backgroundColor: [
                    '#4CAF50', '#2196F3', '#FFC107', '#F44336', '#9C27B0',
                    '#00BCD4', '#FF9800', '#795548', '#607D8B', '#E91E63'
                  ],
                }]
              },
              options: {
                responsive: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: true,
                    text: 'Expense Distribution',
                    font: {
                      size: 16,
                      weight: 'bold'
                    }
                  },
                  datalabels: {
                    formatter: (value, ctx) => {
                      const dataset = ctx.chart.data.datasets[0];
                      const total = dataset.data.reduce((acc, data) => acc + data, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return percentage + '%';
                    },
                    color: '#fff',
                    font: {
                      weight: 'bold',
                      size: 10
                    }
                  }
                }
              }
            });
          </script>
        </body>
      </html>
    `

    await page.setContent(html)
    await page.waitForSelector("canvas")

    // Take a screenshot of the canvas
    const element = await page.$("canvas")
    const screenshot = await element!.screenshot({ encoding: "base64" })

    return screenshot
  } catch (error) {
    console.error("Error generating pie chart:", error)
    throw error
  } finally {
    if (browser) {
      await browser.close()
    }
  }
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
      <h1>Your SpendWise Expense Report</h1>
      <p>Please find your requested expense report attached.</p>
    `,
    attachments: [
      {
        filename: `${name}_report.${fileExtension}`,
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
      let yPos = 0
      if (includeCharts) {
        try {
          const pieChartBase64 =
            await generatePieChartWithPuppeteer(pieChartData)
          doc.addImage(
            `data:image/png;base64,${pieChartBase64}`,
            "PNG",
            50,
            70,
            110,
            100
          )
        } catch (error) {
          console.error("Error generating pie chart:", error)
          // Handle the error as needed (e.g., add a text note in the PDF)
        }
        doc.setFontSize(16)
        doc.setTextColor("#2E7D32")
        doc.setFont("helvetica", "bold")
        doc.text("Expense Distribution", 14, 175)

        // Improve layout of category totals
        let leftCol = 20
        let rightCol = pageWidth / 2 + 10
        yPos = 190
        expensesByCategory.forEach((category, index) => {
          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          doc.setTextColor(60, 60, 60)
          const text = `${category.category}: -${Number(category._sum.amount || 0).toFixed(2)}`
          doc.text(text, index % 2 === 0 ? leftCol : rightCol, yPos)
          if (index % 2 !== 0) yPos += 10
        })
        yPos = Math.max(yPos + 20, 250)
      } else {
        yPos = 90
      }
      const totalExpenses = expenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      )
      const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0)

      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.setTextColor("#F44336")
      doc.text(`Total Expense:`, 14, yPos - 5)
      doc.text(`-${totalExpenses.toFixed(2)}`, pageWidth - 14, yPos - 5, {
        align: "right",
      })
      yPos += 15
      if (includeIncome) {
        doc.setTextColor("#2E7D32")
        doc.text(`Total Income:`, 14, yPos - 5)
        doc.text(`+${totalIncome.toFixed(2)}`, pageWidth - 14, yPos - 5, {
          align: "right",
        })
        yPos += 15
        doc.setTextColor("#1976D2")
        doc.text(`Net:`, 14, yPos - 5)
        doc.text(
          `${(totalIncome - totalExpenses).toFixed(2)}`,
          pageWidth - 14,
          yPos - 5,
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
      name,
    }
  }
}
