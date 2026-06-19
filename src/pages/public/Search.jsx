const InfoRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[15px] bg-primary-tint text-primary">
        <span className="material-symbols-rounded text-xl">{icon}</span>
      </span>

      <div>
        <p className="text-xs font-bold text-ink-muted">{label}</p>
        <p className="text-sm font-extrabold text-ink">{value}</p>
      </div>
    </div>
  );
};

export default Search;