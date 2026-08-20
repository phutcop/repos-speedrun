import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function ExpenseTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="var(--border-soft)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "var(--ink)", opacity: 0.6 }}
          axisLine={{ stroke: "var(--border-soft)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--ink)", opacity: 0.55 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            borderRadius: 8,
            color: "var(--ink)",
            fontSize: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
          labelStyle={{ color: "var(--ink)", fontWeight: 600, fontFamily: "Playfair Display, serif" }}
          formatter={(value) => [`$${value.toLocaleString()}`, "Expense"]}
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="var(--chart-1)"
          strokeWidth={2.4}
          dot={{ r: 3.5, fill: "var(--chart-1)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ExpenseTrendChart;
