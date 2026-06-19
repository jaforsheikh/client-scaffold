const StatCard = ({
  icon = "monitoring",
  label = "Total",
  value = "0",
  note,
  tone = "primary",
}) => {
  const toneStyles = {
    primary: "bg-primary-tint text-primary",
    teal: "bg-teal-tint text-teal",
    success: "bg-state-successTint text-state-success",
    warning: "bg-state-warningTint text-state-warning",
    danger: "bg-red-50 text-state-danger",
    dark: "bg-ink text-white",
  };

  return (
    <div className="sc-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-ink-muted">{label}</p>

          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
            {value}
          </h3>

          {note ? (
            <p className="mt-2 text-xs font-bold leading-5 text-ink-muted">
              {note}
            </p>
          ) : null}
        </div>

        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px]",
            toneStyles[tone] || toneStyles.primary,
          ].join(" ")}
        >
          <span className="material-symbols-rounded text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;