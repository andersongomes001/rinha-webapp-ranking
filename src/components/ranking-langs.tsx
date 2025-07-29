
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import type {RankingData} from "@/types/ranking-data.ts";

interface RankingLangsProps {
    rankingData?: RankingData[]
}
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 p-2 border rounded shadow-md text-sm">
                <p className="font-bold">{label}</p>
                <p>Total: {payload[0].value}</p>
            </div>
        );
    }
    return null;
};

export function RankingLangs({rankingData}: RankingLangsProps) {
    const langs: string[] = rankingData?.flatMap((item) => item.langs) ?? [];
    const acc: Record<string, number> = langs.reduce((acc: Record<string, number>, lang) => {
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
    }, {});
    const data = Object.entries(acc).map(([lang, count]) => ({
        name: lang,
        count: count,
    }));

    return (
        <>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                    <XAxis
                        dataKey="name"
                           angle={-45}
                           textAnchor="end"
                           interval={0}
                           dy={1}/>
                    <YAxis/>
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#af1338" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
