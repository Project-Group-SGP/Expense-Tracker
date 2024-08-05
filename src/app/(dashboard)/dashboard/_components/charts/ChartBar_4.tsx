"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartData3 } from "../Dropdown_chart_1"
import { cn } from "@/lib/utils"

const chartConfig = {
  spend: {
    label: "spend",
    color: "#2563eb",
  },
} //satisfies ChartConfig

type chartDataProps = {
  chartData: ChartData3[]
}

export function ChartBar_4({ chartData }: chartDataProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("spend")

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.spend, 0),
    }),
    []
  )

  const handleChartChange = (chart: keyof typeof chartConfig) => {
    setActiveChart(chart)
  }

  return (
    <>
      <div className="flex">
        {Object.keys(chartConfig).map((key) => {
          const chart = key as keyof typeof chartConfig
          return (
            <button
              key={chart}
              data-active={activeChart === chart}
              className={cn("relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6 ","dark:bg-black shadow-none border-none bg-white")}
              onClick={() => handleChartChange(chart)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[chart].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total.desktop.toLocaleString()}
              </span>
            </button>
          )
        })}
      </div>

      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <BarChart
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value)
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="w-[150px]"
                nameKey="views"
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }}
              />
            }
          />
          <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
        </BarChart>
      </ChartContainer>
    </>
  )
}
