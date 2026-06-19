const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled = false,
  loading = false,
  onClick,
}) => {
  const variants = {
    primary:
      "bg-primary text-white shadow-glow hover:bg-primary-dark border border-primary",
    secondary:
      "bg-white text-ink border border-surface-border hover:border-primary/30 hover:bg-primary-tint hover:text-primary",
    ghost:
      "bg-transparent text-ink-muted border border-transparent hover:bg-primary-tint hover:text-primary",
    danger:
      "bg-state-danger text-white border border-state-danger hover:bg-red-700",
    success:
      "bg-state-success text-white border border-state-success hover:bg-green-700",
    dark: "bg-ink text-white border border-ink hover:bg-ink-soft",
  };

  const sizes = {
    sm: "min-h-10 px-4 py-2 text-xs rounded-xl",
    md: "min-h-12 px-5 py-3 text-sm rounded-button",
    lg: "min-h-14 px-6 py-4 text-base rounded-[16px]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-2 font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className,
      ].join(" ")}
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm" />
      ) : icon ? (
        <span className="material-symbols-rounded">{icon}</span>
      ) : null}

      {children}
    </button>
  );
};

export default Button;