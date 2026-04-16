import {
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

export default function GraficoMensal({ dados }: any) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={dados}>
        <CartesianGrid stroke="#374151" strokeDasharray="3 3" />

        <XAxis dataKey="mes" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />

        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "none",
            borderRadius: "8px",
            color: "white",
          }}
        />

        {/* 🔥 AQUI FUNCIONA */}
        <Area
          type="monotone"
          dataKey="entradas"
          stroke="#22c55e"
          fill="#22c55e33"
          strokeWidth={3}
        />

        <Area
          type="monotone"
          dataKey="saidas"
          stroke="#ef4444"
          fill="#ef444433"
          strokeWidth={3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
