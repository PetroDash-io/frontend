import { colors } from "@/utils/constants";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

interface CurveDataPoint {
  date: string;
  oil: number | null;
  gas: number | null;
  water: number | null;
}

interface CurveChartProps {
    data: CurveDataPoint[];
}

export function CurveChart({ data }: CurveChartProps) {
    return (
        <div style={styles.curveChartWrapper}>
            <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" minTickGap={18} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="oil" name="Petróleo" dot={false} connectNulls={false}/>
                        <Line type="monotone" dataKey="gas" name="Gas" dot={false} connectNulls={false}/>
                        <Line type="monotone" dataKey="water" name="Agua" dot={false} connectNulls={false}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const styles = {
    curveChartWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        borderRadius: 14,
        border: `1px solid ${colors.panelBorder}`,
        color: colors.textLight,
        marginTop: 50,
    } as React.CSSProperties,
} as const;