type Props = {
  value?: string;
  type?: "approval" | "execution";
};

const normalize = (value?: string) =>
  (value || "").toUpperCase().replace(/\s+/g, "_");

const prettify = (value?: string) =>
  (value || "—")
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function StatusBadge({ value, type = "approval" }: Props) {
  const normalized = normalize(value);

  return (
    <span
      className={`status-badge ${type} ${normalized
        .toLowerCase()
        .replace(/_/g, "-")}`}
    >
      {prettify(value)}
    </span>
  );
}