"use client"
import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, User, Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { generateFinancialAdvice } from "../actions"
import { readStreamableValue } from "ai/rsc"
import { Month } from "../actions"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCurrentUserClient } from "@/hooks/use-current-user"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import remarkGfm from "remark-gfm"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIInsight() {
  const [fromMonth, setFromMonth] = useState<Month | "">("")
  const [toMonth, setToMonth] = useState<Month | "">("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello, I am your **AI-powered financial advisor**. Please select a time period to generate financial insights?",
    },
  ])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const user = useCurrentUserClient()

  useEffect(() => {
    if (fromMonth && toMonth) {
      const fromIndex = months.indexOf(fromMonth)
      const toIndex = months.indexOf(toMonth)
      if (fromIndex > toIndex) {
        setToMonth("")
      }
    }
  }, [fromMonth, toMonth])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async () => {
    if (fromMonth && toMonth) {
      setIsLoading(true)
      setOpen(true)
      setError(null)
      let userMessage = `Generate financial insights for the period from ${fromMonth} to ${toMonth}.`
      setMessages((prev) => [...prev, { role: "user", content: userMessage }])

      try {
        const { output } = await generateFinancialAdvice(
          fromMonth as Month,
          toMonth
        )
        let assistantMessage = ""

        for await (const delta of readStreamableValue(output as any)) {
          assistantMessage += delta
          setMessages((prev) => {
            const newMessages = [...prev]
            if (newMessages[newMessages.length - 1].role === "assistant") {
              newMessages[newMessages.length - 1].content = assistantMessage
            } else {
              newMessages.push({ role: "assistant", content: assistantMessage })
            }
            return newMessages
          })
        }
      } catch (err) {
        console.error("Error generating financial advice:", err)
        setError("An error occurred while generating financial insights.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                className="fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full border border-dotted border-zinc-700 p-0 shadow-lg transition-shadow duration-300 hover:shadow-xl sm:h-14 sm:w-14 md:h-16 md:w-16"
                variant="outline"
                aria-label="Open Financial AI Insight"
              >
                <svg
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  strokeWidth="3"
                  fill="none"
                  className="h-8 w-8 stroke-zinc-500 dark:stroke-gray-300 sm:h-10 sm:w-10 md:h-12 md:w-12"
                >
                  <svg
                    viewBox="0 0 64 64"
                    xmlns="http://www.w3.org/2000/svg"
                    strokeWidth="3"
                    fill="none"
                    className="h-8 w-8 stroke-zinc-500 dark:stroke-gray-300 sm:h-10 sm:w-10 md:h-12 md:w-12"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <line x1="50.4" y1="24.38" x2="58.3" y2="23.14"></line>
                      <line x1="47.93" y1="17.11" x2="52.87" y2="14.2"></line>
                      <line x1="42.89" y1="11.73" x2="46.21" y2="4.51"></line>
                      <line x1="33.45" y1="10.69" x2="33.41" y2="4.96"></line>
                      <line x1="24.29" y1="12.09" x2="21.62" y2="4.51"></line>
                      <line x1="17.99" y1="17.03" x2="12.96" y2="14.29"></line>
                      <line x1="15.78" y1="23.97" x2="8.03" y2="22.66"></line>
                      <path d="M26.22,45.47c0-5.16-3.19-9.49-4.91-12.69A12.24,12.24,0,0,1,19.85,27c0-6.79,6.21-12.3,13-12.3"></path>
                      <path d="M39.48,45.47c0-5.16,3.19-9.49,4.91-12.69A12.24,12.24,0,0,0,45.85,27c0-6.79-6.21-12.3-13-12.3"></path>
                      <rect
                        x="23.63"
                        y="45.19"
                        width="18.93"
                        height="4.25"
                        rx="2.12"
                      ></rect>
                      <rect
                        x="24.79"
                        y="49.43"
                        width="16.61"
                        height="4.25"
                        rx="2.12"
                      ></rect>
                      <path d="M36.32,53.68v.84a3.23,3.23,0,1,1-6.44,0v-.84"></path>
                      <path d="M24.57,26.25a7.5,7.5,0,0,1,7.88-7.11"></path>
                    </g>
                  </svg>{" "}
                </svg>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Get AI-powered financial insights</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-[95vw] flex-col gap-0 bg-background p-0 text-foreground sm:h-[80vh] sm:max-h-[80vh] sm:w-[90vw]">
        <DialogHeader className="p-4 sm:p-6">
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            Financial AI Insight
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow px-4 pb-4 sm:px-6">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[90%] items-start gap-2 ${message.role === "user" ? "flex-row-reverse" : ""} sm:max-w-[85%]`}
                >
                  <Avatar className="mt-1 h-8 w-8 sm:h-10 sm:w-10">
                    {message.role === "user" ? (
                      //@ts-ignore
                      <>
                        <AvatarImage src={user?.image || ""} alt="User" />
                        <AvatarFallback>
                          <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        {/* <AvatarImage src="/ai-avatar.png" alt="AI Assistant" /> */}
                        <AvatarFallback>
                          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>

                  <div
                    className={`rounded-lg p-2 sm:p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"} overflow-x-auto`}
                  >
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        className="prose max-w-none overflow-x-auto text-sm dark:prose-invert sm:text-base"
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              {...props}
                              className="mb-4 border-b-2 border-green-500 pb-2 text-2xl font-bold text-green-600 dark:border-green-700 dark:text-green-400"
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              {...props}
                              className="mb-3 mt-5 border-l-4 border-green-500 pl-2 text-xl font-semibold text-green-600 dark:border-green-700 dark:text-green-400"
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              {...props}
                              className="mb-2 text-lg font-semibold text-green-600 dark:text-green-400"
                            />
                          ),

                          p: ({ node, ...props }) => (
                            <p
                              {...props}
                              className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200"
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              {...props}
                              className="mb-4 list-disc pl-5 [&>li]:mb-2"
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              {...props}
                              className="mb-4 list-decimal pl-5 [&>li]:mb-2"
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li
                              {...props}
                              className="text-gray-800 dark:text-gray-200"
                            />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong
                              {...props}
                              className="font-semibold text-gray-900 dark:text-gray-100"
                            />
                          ),
                          em: ({ node, ...props }) => (
                            <em
                              {...props}
                              className="font-semibold italic text-green-600 dark:text-green-400"
                            />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              {...props}
                              className="border-l-4 border-green-500 pl-4 italic text-gray-600 dark:border-green-700 dark:text-gray-400"
                            />
                          ),
                          code: ({ node, ...props }) => (
                            <code
                              {...props}
                              className="block overflow-x-auto rounded-lg bg-gray-100 p-3 font-mono text-sm text-green-600 dark:bg-gray-800 dark:text-green-400"
                            />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto">
                              <table
                                {...props}
                                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                              />
                            </div>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead
                              {...props}
                              className="bg-gray-50 dark:bg-gray-800"
                            />
                          ),
                          tbody: ({ node, ...props }) => (
                            <tbody
                              {...props}
                              className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900"
                            />
                          ),
                          tr: ({ node, ...props }) => (
                            <tr
                              {...props}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800"
                            />
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              {...props}
                              className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td
                              {...props}
                              className="whitespace-nowrap px-4 py-2 text-sm text-gray-900 dark:text-gray-100"
                            />
                          ),
                          div: ({ node, ...props }) => (
                            <div {...props} className="my-0" />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-sm sm:text-base">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="border-t p-4 sm:p-6">
          {!open && (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <label
                    htmlFor="fromMonth"
                    className="mb-1 block text-sm font-medium"
                  >
                    From
                  </label>
                  <Select
                    value={fromMonth}
                    onValueChange={(value) => {
                      setFromMonth(value as Month)
                      if (
                        toMonth &&
                        months.indexOf(value) > months.indexOf(toMonth)
                      ) {
                        setToMonth("")
                      }
                    }}
                  >
                    <SelectTrigger
                      id="fromMonth"
                      className="bg-background text-foreground"
                    >
                      <SelectValue placeholder="From Month" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[40vh] overflow-y-auto">
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="toMonth"
                    className="mb-1 block text-sm font-medium"
                  >
                    To
                  </label>
                  <Select
                    value={toMonth}
                    onValueChange={(value) => setToMonth(value as Month)}
                    disabled={!fromMonth}
                  >
                    <SelectTrigger
                      id="toMonth"
                      className="bg-background text-foreground"
                    >
                      <SelectValue placeholder="To Month" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[40vh] overflow-y-auto">
                      {months.map((month, index) => (
                        <SelectItem
                          key={month}
                          value={month}
                          disabled={
                            !fromMonth || index < months.indexOf(fromMonth)
                          }
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
                disabled={!fromMonth || !toMonth}
                className="w-full"
              >
                Generate Financial Insights
              </Button>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Generating Insights...</span>
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
