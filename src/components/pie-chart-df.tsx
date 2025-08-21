import {
    Bar,
    BarChart, CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip, XAxis,
    YAxis
} from "recharts";

interface PieChartDFProps {
    default_router?: number,
    fallback_router?: number
}

export default function PieChartDF({default_router, fallback_router}: PieChartDFProps) {

    const data = [
        {
            name: 'Destino dos pagamentos',
            Default: default_router,
            Fallback: fallback_router,
        },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Default" fill="var(--color-green-600)" />
                <Bar dataKey="Fallback" fill="var(--color-red-600)" />
            </BarChart>
        </ResponsiveContainer>
    );
}
