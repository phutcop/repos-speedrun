import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const BAR_COLORS = ["#212842", "#3f5b8a", "#6c86b8", "#9eccfa", "#c9def5", "#e4edfa"];

function DepartmentBarChart({ data }) {
  // Dynamically calculate height so bars don't squish if there are many departments
  const chartHeight = Math.max(260, data.length * 45);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 8, bottom: 10 }}>
        <CartesianGrid stroke="var(--border-soft)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "var(--ink)", opacity: 0.55 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
        />
        <YAxis
          type="category"
          dataKey="department"
          width={110}
          tick={{ fontSize: 12, fill: "var(--ink)", opacity: 0.75 }}
          axisLine={false}
          tickLine={false}
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
          formatter={(value) => [`$${value.toLocaleString()}`, "Spend"]}
        />
        <Bar dataKey="spend" radius={[0, 6, 6, 0]} barSize={16}>
          {data.map((entry, i) => (
            <Cell key={entry.department} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default DepartmentBarChart;
