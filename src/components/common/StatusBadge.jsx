const statusStyles = {
  pending: "border-state-warning/15 bg-state-warningTint text-state-warning",
  inprogress: "border-blue-500/15 bg-blue-50 text-blue-700",
  done: "border-state-success/15 bg-state-successTint text-state-success",
  canceled: "border-state-danger/15 bg-red-50 text-state-danger",
  active: "border-state-success/15 bg-state-successTint text-state-success",
  blocked: "border-state-danger/15 bg-red-50 text-state-danger",
  donor: "border-primary/15 bg-primary-tint text-primary",
  volunteer: "border-teal/15 bg-teal-tint text-teal",
  admin: "border-ink/15 bg-ink text-white",
};

const formatLabel = (value) => {
  if (!value) return "Unknown";

  if (value === "inprogress") return "In Progress";

  return value
    .split("-")
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const StatusBadge = ({ status = "pending", label }) => {
  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-extrabold",
        statusStyles[status] || "border-surface-border bg-surface-soft text-ink-muted",
      ].join(" ")}
    >
      {label || formatLabel(status)}
    </span>
  );
};

export default StatusBadge;