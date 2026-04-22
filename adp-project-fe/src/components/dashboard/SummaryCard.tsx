type SummaryCardProps = {
  title: string;
  value: string | number;
  topBorderClass: string;
};

export default function SummaryCard({
  title,
  value,
  topBorderClass,
}: SummaryCardProps) {
  return (
    <div className={`summary-card ${topBorderClass}`}>
      <p className="summary-card-title">{title}</p>
      <h2 className="summary-card-value">{value}</h2>
    </div>
  );
}