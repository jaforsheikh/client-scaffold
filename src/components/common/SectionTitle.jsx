const SectionTitle = ({
  eyebrow,
  title,
  highlight,
  description,
  align = "center",
  className = "",
}) => {
  const alignment = {
    left: "items-start text-left",
    center: "items-center text-center",
  };

  return (
    <div
      className={[
        "flex flex-col",
        alignment[align] || alignment.center,
        className,
      ].join(" ")}
    >
      {eyebrow ? (
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary-tint px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
          <span className="material-symbols-rounded text-base">favorite</span>
          {eyebrow}
        </p>
      ) : null}

      <h2 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
        {title}{" "}
        {highlight ? <span className="text-primary">{highlight}</span> : null}
      </h2>

      {description ? (
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-ink-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionTitle;