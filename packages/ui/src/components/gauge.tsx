"use client"

import {
    Label,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer
} from "recharts"
import { cn } from "@workspace/ui/lib/utils"

interface GaugeProps {
    value: number
    max?: number
    label?: string
    className?: string
    showValue?: boolean
    size?: "sm" | "md" | "lg"
}

export function Gauge({ value, max = 10, label, className, showValue = true, size = "md" }: GaugeProps) {
    // Normalize value to ensure it's within 0-max
    const safeValue = Math.min(Math.max(value, 0), max);

    // Calculate percentage for color logic
    const percentage = (safeValue / max) * 100;

    // Color logic
    let fillColor = "#ef4444" // red-500
    if (percentage >= 80) fillColor = "#22c55e" // green-500
    else if (percentage >= 50) fillColor = "#f59e0b" // amber-500

    // Data structure:
    // "track" is the gray background (full max value).
    // "value" is the actual score.
    // We explicitly separate them to overlay them. Recharts renders in order.
    const chartData = [
        {
            fill: fillColor,
            value: safeValue,
            max: max
        }
    ]

    const sizeClasses = {
        sm: "h-[80px] w-[80px]",
        md: "h-[150px] w-[150px]",
        lg: "h-[200px] w-[200px]",
    }

    const fontSizeClasses = {
        sm: "text-lg",
        md: "text-3xl",
        lg: "text-4xl"
    }

    const labelOffset = {
        sm: 10,
        md: 16,
        lg: 20
    }

    return (
        <div className={cn("flex flex-col items-center justify-center", sizeClasses[size], className)}>
            <ResponsiveContainer width="100%" height="100%" className="aspect-square">
                <RadialBarChart
                    data={chartData}
                    startAngle={180}
                    endAngle={0}
                    innerRadius="75%"
                    outerRadius="100%"
                >
                    {/* Background Track: We use the 'max' value to simulate the full track */}
                    <RadialBar
                        dataKey="max"
                        className="fill-muted/20 stroke-transparent"
                        cornerRadius={5}
                    />
                    {/* Value Bar */}
                    <RadialBar
                        dataKey="value"
                        fill={fillColor}
                        cornerRadius={5}
                        className="stroke-transparent stroke-2"
                    />
                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                        {showValue && (
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        const box = viewBox as { cx: number, cy: number };
                                        if (box.cx && box.cy) {
                                            return (
                                                <text
                                                    x={box.cx}
                                                    y={box.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={box.cx}
                                                        y={box.cy}
                                                        className={cn("fill-foreground font-bold", fontSizeClasses[size])}
                                                    >
                                                        {safeValue}
                                                    </tspan>
                                                    {label && (
                                                        <tspan
                                                            x={box.cx}
                                                            y={box.cy + labelOffset[size]}
                                                            className="fill-muted-foreground text-xs"
                                                        >
                                                            {label}
                                                        </tspan>
                                                    )}
                                                </text>
                                            )
                                        }
                                    }
                                    return null;
                                }}
                            />
                        )}
                    </PolarRadiusAxis>
                </RadialBarChart>
            </ResponsiveContainer>
        </div>
    )
}
