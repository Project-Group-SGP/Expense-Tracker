"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DatePicker } from "./Date-Picker"
import { format, isAfter, isBefore, startOfDay } from "date-fns"
import { generateReport } from "./actions"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CategoryTypes } from "@prisma/client"

export default function Report() {
  const [reportType, setReportType] = useState<string>("last_month")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [reportFormat, setReportFormat] = useState<string>("pdf")
  const [includeCharts, setIncludeCharts] = useState<boolean>(true)
  const [isDetailed, setIsDetailed] = useState<boolean>(false)
  const [selectedCategories, setSelectedCategories] = useState<CategoryTypes[]>(
    []
  )
  const [includeIncome, setIncludeIncome] = useState<boolean>(true)
  const [emailReport, setEmailReport] = useState<boolean>(false)
  const [emailAddress, setEmailAddress] = useState<string>("")

  const today = startOfDay(new Date())

  const handleReportTypeChange = (value: string) => {
    setReportType(value)
    if (value !== "custom") {
      setStartDate(undefined)
      setEndDate(undefined)
    }
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (date && isAfter(date, today)) {
      toast.error("Start date cannot be in the future")
      return
    }
    if (date && endDate && isAfter(date, endDate)) {
      toast.error("Start date cannot be after end date")
      return
    }
    setStartDate(date)
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && isAfter(date, today)) {
      toast.error("End date cannot be in the future")
      return
    }
    if (date && startDate && isBefore(date, startDate)) {
      toast.error("End date cannot be before start date")
      return
    }
    setEndDate(date)
  }

  const handleGenerateReport = async () => {
    if (reportType === "custom" && (!startDate || !endDate)) {
      toast.error("Please select both start and end dates for custom range")
      return
    }

    const loading = toast.loading("Generating report...")
    setIsGenerating(true)
    try {
      const { buffer, mimeType, fileExtension, name } = await generateReport(
        reportType,
        startDate,
        endDate,
        reportFormat,
        includeCharts,
        isDetailed,
        selectedCategories,
        includeIncome,
        emailReport,
        emailAddress
      )
      if (emailReport) {
        toast.success("Report sent to your email successfully!", {
          id: loading,
        })
      } else {
        const fileData = atob(buffer)
        const uint8Array = new Uint8Array(fileData.length)
        for (let i = 0; i < fileData.length; i++) {
          uint8Array[i] = fileData.charCodeAt(i)
        }
        const blob = new Blob([uint8Array], { type: mimeType })

        // Create a download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url

        // Set the filename
        const startDateStr = startDate ? format(startDate, "ddMMyyyy") : ""
        const endDateStr = endDate ? format(endDate, "ddMMyyyy") : ""
        const dateRange =
          startDateStr && endDateStr ? `_${startDateStr}_${endDateStr}` : ""
        link.download = `${name?.replace(/\s+/g, "_")}_expense_report${dateRange}.${fileExtension}`

        // Trigger the download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up
        window.URL.revokeObjectURL(url)
        toast.success("Report generated successfully!", {
          id: loading,
        })
      }
    } catch (error) {
      console.error("Error generating report:", error)
      toast.error("Failed to generate report", {
        id: loading,
      })
    }
    setIsGenerating(false)
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
                  onValueChange={handleReportTypeChange}
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
                    <DatePicker
                      date={startDate}
                      setDate={handleStartDateChange}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="end-date" className="mb-2 block">
                      End Date
                    </Label>
                    <DatePicker date={endDate} setDate={handleEndDateChange} />
                  </div>
                </div>
              )}

              <div>
                <Label className="text-base">Report Format</Label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={includeCharts}
                  onCheckedChange={(checked) =>
                    setIncludeCharts(checked === true)
                  }
                />
                <Label htmlFor="includeCharts">Include Charts</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="detailedReport"
                  checked={isDetailed}
                  onCheckedChange={setIsDetailed}
                />
                <Label htmlFor="detailedReport">Detailed Report</Label>
              </div>

              <div>
                <Label className="text-base">Select Categories</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.values(CategoryTypes).map((category) => (
                    <Button
                      key={category}
                      variant="outline"
                      size="sm"
                      className={cn(
                        selectedCategories.includes(category) &&
                          "bg-primary text-primary-foreground"
                      )}
                      onClick={() => {
                        setSelectedCategories((prev) =>
                          prev.includes(category)
                            ? prev.filter((c) => c !== category)
                            : [...prev, category]
                        )
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeIncome"
                  checked={includeIncome}
                  onCheckedChange={(checked) =>
                    setIncludeIncome(checked === true)
                  }
                />
                <Label htmlFor="includeIncome">Include Income</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="emailReport"
                  checked={emailReport}
                  onCheckedChange={setEmailReport}
                />
                <Label htmlFor="emailReport">Email Report</Label>
              </div>

              {emailReport && (
                <div>
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Enter your email address"
                    className="mt-1"
                  />
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
