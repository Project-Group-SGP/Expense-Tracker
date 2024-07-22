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
import { ChartBar_1 } from "./ChartBar_1"
import { ChartBar_3 } from "./ChartBar_3"
import { ChartBar_4 } from "./ChartBar_4"

export function Dropdown_chart_1() {
  const [selectedChart, setSelectedChart] = React.useState("Bar chart_1")

  const renderChart = () => {
    switch (selectedChart) {
      case "Bar chart_1":
        return <ChartBar_1 />
      case "Bar chart_2":
        return <ChartBar_3 />
      case "Bar chart_3":
        return <ChartBar_4 />
      default:
        return <ChartBar_3 />
    }
  }

  return (
    <>
      <div className="flex items-center justify-between p-4 w-max-[400px]">
        <p className="font-semibold">Transactions</p>
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
              <DropdownMenuRadioItem value="Bar chart_1">
                Bar chart_1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Bar chart_2">
                Bar chart_2
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Bar chart_3">
                Bar chart_3
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="p-4">{renderChart()}</div>
    </>
  )
}
