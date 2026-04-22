type BreakdownRow = {
  label: string;
  count: number;
};

type BreakdownCardProps = {
  title: string;
  total: number;
  rows: BreakdownRow[];
  variant: "approved" | "revision" | "unapproved";
  onClick?: () => void;
};

export default function BreakdownCard({
  title,
  total,
  rows,
  variant,
  onClick,
}: BreakdownCardProps) {
  return (
    <button
      type="button"
      className={`breakdown-card ${variant}`}
      onClick={onClick}
    >
      <div className="breakdown-card-header">
        <h3>{title}</h3>
        <span className="breakdown-total">{total}</span>
      </div>

      <div className="breakdown-divider" />

      <div className="breakdown-rows">
        {rows.map((row) => (
          <div key={row.label} className="breakdown-row">
            <span>{row.label}</span>
            <span className="breakdown-pill">{row.count}</span>
          </div>
        ))}
      </div>
    </button>
  );
}