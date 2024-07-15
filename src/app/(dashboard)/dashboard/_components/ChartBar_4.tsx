"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
const chartData = [
  { date: "2024-04-01", spend: 222 },
  { date: "2024-04-02", spend: 97 },
  { date: "2024-04-03", spend: 167 },
  { date: "2024-04-04", spend: 242 },
  { date: "2024-04-05", spend: 373 },
  { date: "2024-04-06", spend: 301 },
  { date: "2024-04-07", spend: 245 },
  { date: "2024-04-08", spend: 409 },
  { date: "2024-04-09", spend: 59 },
  { date: "2024-04-10", spend: 261 },
  { date: "2024-04-11", spend: 327 },
  { date: "2024-04-12", spend: 292 },
  { date: "2024-04-13", spend: 342 },
  { date: "2024-04-14", spend: 137 },
  { date: "2024-04-15", spend: 120 },
  { date: "2024-04-16", spend: 138 },
  { date: "2024-04-17", spend: 446 },
  { date: "2024-04-18", spend: 364 },
  { date: "2024-04-19", spend: 243 },
  { date: "2024-04-20", spend: 89 },
  { date: "2024-04-21", spend: 137 },
  { date: "2024-04-22", spend: 224 },
  { date: "2024-04-23", spend: 138 },
  { date: "2024-04-24", spend: 387 },
  { date: "2024-04-25", spend: 215 },
  { date: "2024-04-26", spend: 75 },
  { date: "2024-04-27", spend: 383 },
  { date: "2024-04-28", spend: 122 },
  { date: "2024-04-29", spend: 315 },
  { date: "2024-04-30", spend: 454 },
  { date: "2024-05-01", spend: 165 },
  { date: "2024-05-02", spend: 293 },
  { date: "2024-05-03", spend: 247 },
  { date: "2024-05-04", spend: 385 },
  { date: "2024-05-05", spend: 481 },
  { date: "2024-05-06", spend: 498 },
  { date: "2024-05-07", spend: 388 },
  { date: "2024-05-08", spend: 149 },
  { date: "2024-05-09", spend: 227 },
  { date: "2024-05-10", spend: 293 },
  { date: "2024-05-11", spend: 335 },
  { date: "2024-05-12", spend: 197 },
  { date: "2024-05-13", spend: 197 },
  { date: "2024-05-14", spend: 448 },
  { date: "2024-05-15", spend: 473 },
  { date: "2024-05-16", spend: 338 },
  { date: "2024-05-17", spend: 499 },
  { date: "2024-05-18", spend: 315 },
  { date: "2024-05-19", spend: 235 },
  { date: "2024-05-20", spend: 177 },
  { date: "2024-05-21", spend: 82 },
  { date: "2024-05-22", spend: 81 },
  { date: "2024-05-23", spend: 252 },
  { date: "2024-05-24", spend: 294 },
  { date: "2024-05-25", spend: 201 },
  { date: "2024-05-26", spend: 213 },
  { date: "2024-05-27", spend: 420 },
  { date: "2024-05-28", spend: 233 },
  { date: "2024-05-29", spend: 78 },
  { date: "2024-05-30", spend: 340 },
  { date: "2024-05-31", spend: 178 },
  { date: "2024-06-01", spend: 178 },
  { date: "2024-06-02", spend: 470 },
  { date: "2024-06-03", spend: 103 },
  { date: "2024-06-04", spend: 439 },
  { date: "2024-06-05", spend: 88 },
  { date: "2024-06-06", spend: 294 },
  { date: "2024-06-07", spend: 323 },
  { date: "2024-06-08", spend: 385 },
  { date: "2024-06-09", spend: 438 },
  { date: "2024-06-10", spend: 155 },
  { date: "2024-06-11", spend: 92 },
  { date: "2024-06-12", spend: 492 },
  { date: "2024-06-13", spend: 81 },
  { date: "2024-06-14", spend: 426 },
  { date: "2024-06-15", spend: 307 },
  { date: "2024-06-16", spend: 371 },
  { date: "2024-06-17", spend: 475 },
  { date: "2024-06-18", spend: 107 },
  { date: "2024-06-19", spend: 341 },
  { date: "2024-06-20", spend: 408 },
  { date: "2024-06-21", spend: 169 },
  { date: "2024-06-22", spend: 317 },
  { date: "2024-06-23", spend: 480 },
  { date: "2024-06-24", spend: 132 },
  { date: "2024-06-25", spend: 141 },
  { date: "2024-06-26", spend: 434 },
  { date: "2024-06-27", spend: 448 },
  { date: "2024-06-28", spend: 149 },
  { date: "2024-06-29", spend: 103 },
  { date: "2024-06-30", spend: 446 },
]

const chartConfig = {
    spend: {
      label: "spend",
      color: "#2563eb"
    }
}; //satisfies ChartConfig

export function ChartBar_4() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("spend")

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.spend, 0),
      
    }),
    []
  )

  const handleChartChange = (chart: keyof typeof chartConfig) => {
    setActiveChart(chart);
  };

  return (
    <>
      <div className="flex">
        {Object.keys(chartConfig).map((key) => {
          const chart = key as keyof typeof chartConfig;
          return (
            <button
              key={chart}
              data-active={activeChart === chart}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => handleChartChange(chart)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[chart].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {total.desktop.toLocaleString()}
              </span>
            </button>
          );
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
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
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
                  });
                }}
              />
            }
          />
          <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
        </BarChart>
      </ChartContainer>
    </>
  );
}