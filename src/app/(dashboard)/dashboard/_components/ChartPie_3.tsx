// import * as React from "react";
// import { LabelList, RadialBar, RadialBarChart } from "recharts";

// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartConfig,
// } from "@/components/ui/chart";

// const chartData = [
//   { category: "Bills", spend: 275, fill: "#0088FE" },
//   { category: "EMI", spend: 200, fill: "#00C49F" },
//   { category: "Entertainment", spend: 287, fill: "#FFBB28" },
//   { category: "Foods", spend: 173, fill: "#FF8042" },
//   { category: "Others", spend: 190, fill: "#00C49F" },
// ];

// const chartConfig = {
//   spend: {
//     label: "spend",
//   },
//   Bills: {
//     label: "Bills",
//     color: "#0088FE",
//   },
//   EMI: {
//     label: "EMI",
//     color: "#00C49F",
//   },
//   Entertainment: {
//     label: "Entertainment",
//     color: "#FFBB28",
//   },
//   Foods: {
//     label: "Foods",
//     color: "#FF8042",
//   },
//   Others: {
//     label: "Others",
//     color: "#00C49F",
//   },
// }satisfies ChartConfig

// export default function ChartPie_3() {
//   return (
//     <ChartContainer
//       config={chartConfig}
//       className="mx-auto aspect-square max-h-[250px]"
//     >
//       <RadialBarChart
//         data={chartData}
//         startAngle={-90}
//         endAngle={270}
//         innerRadius={30}
//         outerRadius={110}
//       >
//         <ChartTooltip
//           cursor={false}
//           content={<ChartTooltipContent hideLabel nameKey="category" />}
//         />
//         <RadialBar dataKey="spend">
//           {chartData.map((entry, index) => (
//             <RadialBar
//               key={`radialbar-${index}`}
//               dataKey="spend"
//               background
//               fill={chartConfig[entry.category].color}
//             />
//           ))}
//           <LabelList
//             position="insideStart"
//             dataKey="spend"
//             className="fill-white capitalize mix-blend-luminosity"
//             fontSize={11}
//             content={({ value }) => (
//               <text x={0} y={0} fill="#fff">
//                 {value}
//               </text>
//             )}
//           />
//         </RadialBar>
//       </RadialBarChart>
//     </ChartContainer>
//   );
// }

"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { category: "Bills", spend: 20705, fill: "#0088FE" },
    { category: "EMI", spend: 10000, fill: "#00C49F" },
    { category: "Entertainment", spend: 9087, fill: "#FFBB28" },
    { category: "Foods", spend: 11173, fill: "#FF8042" },
    { category: "Others", spend: 12190, fill: "#00C49F" },
  ];
  
  const chartConfig = {
    spend: {
      label: "spend",
    },
    Bills: {
      label: "Bills",
      color: "#0088FE",
    },
    EMI: {
      label: "EMI",
      color: "#00C49F",
    },
    Entertainment: {
      label: "Entertainment",
      color: "#FFBB28",
    },
    Foods: {
      label: "Foods",
      color: "#FF8042",
    },
    Others: {
      label: "Others",
      color: "#00C49F",
    },
  }satisfies ChartConfig
  

export  default function ChartPie_3() {
  return (
    <>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="spend" />}
            />
            <RadialBar dataKey="spend" background>
              <LabelList
                position="insideStart"
                dataKey="category"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
  </>)
}
