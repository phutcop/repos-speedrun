import { TrendIcon } from "./Icons";

function SummaryCard({ label, value, delta, trend }) {
  return (
    <div style={{ border: "1px solid var(--ink)", padding: "1.6rem 2rem" }}>
      <div className="card-label">{label}</div>
      <div className="card-value">{value}</div>
      <div className={`card-delta ${trend === "flag" ? "flag" : ""}`}>
        {trend === "up" && <TrendIcon width={14} height={14} />}
        {delta}
      </div>
    </div>
  );
}

export default SummaryCard;
