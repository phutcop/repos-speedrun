import { TrendIcon } from "./Icons";

function SummaryCard({ label, value, delta, trend }) {
  return (
    <div className="panel-card">
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
