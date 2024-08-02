"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DatePicker } from "./Date-Picker"
import { format } from "date-fns"
import { generateReport } from "./actions"

export default function Report() {
  const [reportType, setReportType] = useState<string>("last_month")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      const pdfBuffer = await generateReport(reportType, startDate, endDate)

      const pdfData = atob(pdfBuffer)
      const uint8Array = new Uint8Array(pdfData.length)
      for (let i = 0; i < pdfData.length; i++) {
        uint8Array[i] = pdfData.charCodeAt(i)
      }
      const blob = new Blob([uint8Array], { type: "application/pdf" })

      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url

      // Set the filename
      const startDateStr = startDate ? format(startDate, "yyyyMMdd") : ""
      const endDateStr = endDate ? format(endDate, "yyyyMMdd") : ""
      const dateRange =
        startDateStr && endDateStr ? `_${startDateStr}_${endDateStr}` : ""
      link.download = `expense_report${dateRange}.pdf` // Replace 'username' with actual username if available

      // Trigger the download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between p-4">
      <div className="mt-20 flex w-full flex-col gap-5 px-4">
        <div className="z-10 mb-4 flex items-center justify-between bg-white py-4 dark:bg-zinc-950">
          <h1 className="text-3xl font-bold">Expense Report</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generate Expense Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label className="text-base">Report Type</Label>
                <RadioGroup
                  value={reportType}
                  onValueChange={(value) => setReportType(value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last_month" id="last_month" />
                    <Label htmlFor="last_month">Last Month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last_3_months" id="last_3_months" />
                    <Label htmlFor="last_3_months">Last 3 Months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last_6_months" id="last_6_months" />
                    <Label htmlFor="last_6_months">Last 6 Months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom Date Range</Label>
                  </div>
                </RadioGroup>
              </div>

              {reportType === "custom" && (
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="flex-1">
                    <Label htmlFor="start-date" className="mb-2 block">
                      Start Date
                    </Label>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="end-date" className="mb-2 block">
                      End Date
                    </Label>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerateReport}
                className="w-full sm:w-auto"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
