"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as React from "react"
import { ChartBar_2 } from "./ChartBar_2"
import ChartPie_1 from "./ChartPie_1"
import ChartPie_2 from "./ChartPie_2"
import ChartPie_3 from "./ChartPie_3"

export function Dropdown_chart_2() {
  const [selectedChart, setSelectedChart] = React.useState("pie chart_1")

  const renderChart = () => {
    switch (selectedChart) {
      case "pie chart_1":
        return <ChartPie_1 />
      case "pie chart_2":
        return <ChartPie_2 />
      case "pie chart_3":
        return <ChartPie_3 />
      case "chart_4":
        return <ChartBar_2 />
      default:
        return <ChartPie_1 />
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 w-max-[400px]">
        <p className="font-semibold">Expenses</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-29">
              {selectedChart}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={selectedChart}
              onValueChange={setSelectedChart}
            >
              <DropdownMenuRadioItem value="pie chart_1">
                pie chart_1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pie chart_2">
                pie chart_2
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="pie chart_3">
                pie chart_3
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="chart_4">
                chart_4
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4">{renderChart()}</div>
    </>
  )
}
