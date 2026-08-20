import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

<<<<<<< HEAD
function CategoryPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
=======
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
>>>>>>> main
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
<<<<<<< HEAD
          innerRadius={48}
          outerRadius={78}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="#f7faff" strokeWidth={2} />
=======
          cx={100}
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="var(--bg-main)" strokeWidth={2} />
>>>>>>> main
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
<<<<<<< HEAD
            background: "#212842",
            border: "none",
            borderRadius: 8,
            color: "#f7faff",
            fontSize: 12,
=======
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            borderRadius: 8,
            color: "var(--ink)",
            fontSize: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
>>>>>>> main
          }}
          formatter={(value, name) => [`${value}%`, name]}
        />
        <Legend
<<<<<<< HEAD
          iconType="circle"
          iconSize={7}
          formatter={(value) => <span style={{ fontSize: 11, color: "#212842", opacity: 0.75 }}>{value}</span>}
=======
          layout="vertical"
          verticalAlign="middle"
          align="right"
          content={<CustomLegend />}
          wrapperStyle={{ width: "70%" }}
>>>>>>> main
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CategoryPieChart;
