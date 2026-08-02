import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const BAR_COLORS = ["#212842", "#3f5b8a", "#6c86b8", "#9eccfa", "#c9def5", "#e4edfa"];

function DepartmentBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 4 }}>
        <CartesianGrid stroke="rgba(33,40,66,0.08)" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: "#212842", opacity: 0.55 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
        />
        <YAxis
          type="category"
          dataKey="department"
          width={110}
          tick={{ fontSize: 12, fill: "#212842", opacity: 0.75 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#212842",
            border: "none",
            borderRadius: 8,
            color: "#f7faff",
            fontSize: 12,
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
