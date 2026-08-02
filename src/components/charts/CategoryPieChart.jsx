import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

function CategoryPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={48}
          outerRadius={78}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="#f7faff" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#212842",
            border: "none",
            borderRadius: 8,
            color: "#f7faff",
            fontSize: 12,
          }}
          formatter={(value, name) => [`${value}%`, name]}
        />
        <Legend
          iconType="circle"
          iconSize={7}
          formatter={(value) => <span style={{ fontSize: 11, color: "#212842", opacity: 0.75 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CategoryPieChart;
