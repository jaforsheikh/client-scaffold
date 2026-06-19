const BloodBadge = ({ group = "A+", size = "md" }) => {
  const sizes = {
    sm: "h-9 min-w-9 px-2 text-sm rounded-2xl",
    md: "h-12 min-w-12 px-3 text-base rounded-[18px]",
    lg: "h-16 min-w-16 px-4 text-xl rounded-[22px]",
  };

  return (
    <span
      className={[
        "inline-flex items-center justify-center border border-primary/10 bg-primary-tint font-extrabold tracking-tight text-primary shadow-card",
        sizes[size] || sizes.md,
      ].join(" ")}
      aria-label={`Blood group ${group}`}
    >
      {group}
    </span>
  );
};

export default BloodBadge;