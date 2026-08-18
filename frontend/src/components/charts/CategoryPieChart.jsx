import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "1fr 1fr", 
      gap: "0.5rem 1rem", 
      paddingLeft: "1.5rem" 
    }}>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: entry.color, flexShrink: 0 }} />
          <span style={{ 
            fontSize: "0.7rem", 
            color: "var(--ink)", 
            opacity: 0.85, 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis" 
          }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

function CategoryPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx={100}
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="var(--bg-main)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            borderRadius: 8,
            color: "var(--ink)",
            fontSize: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
          formatter={(value, name) => [`${value}%`, name]}
        />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          content={<CustomLegend />}
          wrapperStyle={{ width: "70%" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CategoryPieChart;
