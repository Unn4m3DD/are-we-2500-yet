"use client";

import { RefreshCwIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ModeToggle } from "@/components/ui/mode-toggle";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
type GraphInfo = {
  name: string;
  points: number;
};
export function Graph({
  bearKiller,
  unnamedInfo,
}: Readonly<{
  bearKiller: GraphInfo;
  unnamedInfo: GraphInfo;
}>) {
  const chartData = [bearKiller, unnamedInfo];
  const maxPoints = Math.max(bearKiller.points, unnamedInfo.points ?? 0);
  return (
    <div className="flex flex-col h-full w-full items-center p-8 gap-12">
      <div className="flex justify-between items-center h-12 text-center flex-col gap-2">
        <div className="text-xl font-bold">Are we 2500 yet?</div>
        <div className="font-medium">
          {maxPoints > 2500
            ? "Yhap, pretty much a gm now, congrats! 🔥"
            : maxPoints > 2480
            ? "It's just a matter of not failing at this point"
            : maxPoints > 2450
            ? "Huh, you might actually do it"
            : maxPoints > 2400
            ? "Close, but still some way to go....."
            : maxPoints > 2300
            ? "Not bad, but I'm sure you could do better"
            : maxPoints > 2200
            ? "Falling off, might as well quit"
            : "https://www.youtube.com/watch?v=okhiO3wJNLU"}
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <ModeToggle />
        <Button
          onClick={() => {
            window.location.reload();
          }}
          size="icon"
        >
          <RefreshCwIcon />
        </Button>
      </div>

      <ChartContainer className="w-96 h-[70vh]" config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value}
          />
          <YAxis
            dataKey="points"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.toLocaleString()}
            tickCount={7}
            domain={[0, 3000]}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="points"
            fill="var(--color-desktop)"
            radius={8}
            label={({ x, y, width, value }) => {
              return (
                <text
                  x={x + width / 2}
                  y={y}
                  fill="#666"
                  textAnchor="middle"
                  dy={-6}
                >
                  {value}
                </text>
              );
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
