const Loader = ({ label = "Loading Scaffold..." }) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-surface-page px-4">
      <div className="sc-card flex w-full max-w-sm flex-col items-center gap-4 p-8 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary-tint text-primary">
          <span className="material-symbols-rounded animate-pulse text-4xl">
            bloodtype
          </span>
          <span className="absolute inset-0 rounded-[24px] border-2 border-primary/20 animate-ping" />
        </div>

        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-ink">
            Please wait
          </h2>

          <p className="mt-1 text-sm font-semibold leading-6 text-ink-muted">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
