"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Loading() {
  const [loadingText, setLoadingText] = useState("Preparing your financial insights")
  const loadingMessages = [
    "Crunching the numbers",
    "Balancing the books",
    "Counting your rupees",
    "Maximizing your savings",
    "Optimizing your budget",
    "Empowering Every Rupee",
    "Your Money, Maximized",
    "Track Smart, Spend Wisely",
    "Savings in Every Swipe",
    "Financial Clarity, One Click Away",
    "Spend with Confidence, Save with Ease",
    "Master Your Money Flow",
    "Budgeting Made Brilliant",
    "Your Finances, Fully Optimized",
    "Effortless Tracking, Smarter Spending"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen mt-8 w-screen items-center justify-center bg-gray-100 dark:bg-zinc-950">
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
        >
          <Image src="/SpendWIse-5.png" width={250} height={250} alt="SpendWise logo" priority />
        </motion.div>
        <motion.p
          className="mt-4 text-5xl font-bold text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Spend<span className="font-bold text-primary">Wise</span>
        </motion.p>
        <motion.div
          className="mt-8 h-2 w-64 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
          initial={{ width: 0 }}
          animate={{ width: "16rem" }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>
        <motion.p
          className="mt-4 text-sm text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {loadingText}...
        </motion.p>
      </div>
    </div>
  )
}