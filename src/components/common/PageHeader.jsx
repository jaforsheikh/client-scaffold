const PageHeader = ({
  eyebrow,
  title,
  description,
  icon = "bloodtype",
  action,
}) => {
  return (
    <div className="sc-card overflow-hidden p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-primary-tint text-primary">
            <span className="material-symbols-rounded text-4xl">{icon}</span>
          </div>

          <div>
            {eyebrow ? (
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-ink-muted sm:text-base sm:leading-7">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
};

export default PageHeader;