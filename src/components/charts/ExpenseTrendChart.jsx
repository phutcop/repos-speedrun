import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function ExpenseTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="rgba(33,40,66,0.08)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#212842", opacity: 0.6 }}
          axisLine={{ stroke: "rgba(33,40,66,0.18)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#212842", opacity: 0.55 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "#212842",
            border: "none",
            borderRadius: 8,
            color: "#f7faff",
            fontSize: 12,
          }}
          labelStyle={{ color: "#9eccfa" }}
          formatter={(value) => [`$${value.toLocaleString()}`, "Expense"]}
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#212842"
          strokeWidth={2.4}
          dot={{ r: 3.5, fill: "#212842" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ExpenseTrendChart;
