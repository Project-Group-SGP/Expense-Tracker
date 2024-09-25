"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useCompletion } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import { generateFinancialAdvice } from '../actions'

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function AIInsight() {
  const [fromMonth, setFromMonth] = useState("")
  const [toMonth, setToMonth] = useState("")

  const { complete, completion, isLoading, error } = useCompletion({
    api: generateFinancialAdvice,
  })

  useEffect(() => {
    if (fromMonth && toMonth) {
      const fromIndex = months.indexOf(fromMonth)
      const toIndex = months.indexOf(toMonth)
      if (fromIndex > toIndex) {
        setToMonth(fromMonth)
      }
    }
  }, [fromMonth, toMonth])

  const handleSubmit = async () => {
    if (fromMonth && toMonth) {
      await complete(`${fromMonth},${toMonth}`)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 p-0 z-50"
          variant="outline"
        >
          <img
            src="/ai-insight-icon.png"
            alt="AI Insight"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Financial AI Insight</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="fromMonth" className="block text-sm font-medium mb-1">
                From
              </label>
              <Select onValueChange={setFromMonth} value={fromMonth}>
                <SelectTrigger id="fromMonth" className="bg-background text-foreground">
                  <SelectValue placeholder="From Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label htmlFor="toMonth" className="block text-sm font-medium mb-1">
                To
              </label>
              <Select onValueChange={setToMonth} value={toMonth}>
                <SelectTrigger id="toMonth" className="bg-background text-foreground">
                  <SelectValue placeholder="To Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem 
                      key={month} 
                      value={month}
                      disabled={Boolean(fromMonth && index < months.indexOf(fromMonth))}
                    >
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !fromMonth || !toMonth}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Insights...
              </>
            ) : (
              "Generate Financial Insights"
            )}
          </Button>
          {completion && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <ReactMarkdown className="prose dark:prose-invert max-w-none">
                {completion}
              </ReactMarkdown>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
              <p className="text-sm">An error occurred while generating the financial insights.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}