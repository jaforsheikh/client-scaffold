const EmptyState = ({
  icon = "inventory_2",
  title = "No data found",
  description = "There is nothing to show here yet.",
  action,
}) => {
  return (
    <div className="sc-card flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
        <span className="material-symbols-rounded text-4xl">{icon}</span>
      </div>

      <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-ink-muted">
        {description}
      </p>

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};

export default EmptyState;