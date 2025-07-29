
import {Cell, Legend, Pie, PieChart, ResponsiveContainer} from "recharts";
import type {RankingData} from "@/types/ranking-data.ts";

interface RankingLangsProps {
    rankingData: RankingData
}
const COLORS = ['#00C49F','#0088FE', '#f6151c', '#FF8042'];

export function DefaulXFallback({rankingData}: RankingLangsProps) {
    const data = [
        { name: 'Default', value: rankingData.data.pagamentos_realizados_default.num_pagamentos },
        { name: 'Fallback', value: rankingData.data.pagamentos_realizados_fallback.num_pagamentos },
        { name: 'Perda', value: rankingData.data.lag.lag }
    ];

    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart width={400} height={400}>
                    <Pie
                        dataKey="value"
                        isAnimationActive={false}
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </>
    );
}
