const InterviewCard = ({ title, children, theme = 'dark' }) => {
  const cardClasses = theme === 'dark'
    ? 'border-slate-800/80 bg-slate-900/80 text-slate-100'
    : 'border-slate-200 bg-white/90 text-slate-900';

  const badgeClasses = theme === 'dark'
    ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
    : 'border-cyan-400/30 bg-cyan-50 text-cyan-700';

  return (
    <section className={`rounded-[1.5rem] border p-4 shadow-2xl shadow-black/20 backdrop-blur sm:rounded-[1.75rem] sm:p-6 ${cardClasses}`}>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">{title}</h2>
        <span className={`w-fit rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] sm:text-xs ${badgeClasses}`}>
          Live quiz
        </span>
      </div>
      {children}
    </section>
  );
};

export default InterviewCard;
