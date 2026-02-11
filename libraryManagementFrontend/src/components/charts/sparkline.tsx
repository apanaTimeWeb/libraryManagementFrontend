'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

interface SparklineProps {
    data: number[];
    color?: string;
    height?: number;
}

export function Sparkline({ data, color = '#2563eb', height = 40 }: SparklineProps) {
    const chartData = data.map((val, i) => ({ i, val }));

    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="rounded border bg-background p-1 text-xs shadow-sm">
                                        {payload[0].value}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="val"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
