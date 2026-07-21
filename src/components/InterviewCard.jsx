const InterviewCard = ({ title, children }) => {
  return (
    <section className="rounded-[1.5rem] border border-slate-800/80 bg-slate-900/80 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:rounded-[1.75rem] sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-white sm:text-xl">{title}</h2>
        <span className="w-fit rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300 sm:text-xs">
          Live quiz
        </span>
      </div>
      {children}
    </section>
  );
};

export default InterviewCard;
