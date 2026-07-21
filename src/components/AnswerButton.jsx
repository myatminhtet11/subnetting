const AnswerButton = ({ label, onClick, isSelected, index, theme = 'dark' }) => {
  const baseClasses = theme === 'dark'
    ? 'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-800'
    : 'border-slate-200 bg-white/90 text-slate-700 hover:border-cyan-400 hover:bg-cyan-50';
  const selectedClasses = theme === 'dark'
    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-lg shadow-cyan-500/10'
    : 'border-cyan-400 bg-cyan-50 text-cyan-700 shadow-lg shadow-cyan-100';
  const numberClasses = theme === 'dark'
    ? 'bg-slate-800 text-slate-300'
    : 'bg-slate-100 text-slate-600';

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition sm:px-4 ${isSelected ? selectedClasses : baseClasses}`}
    >
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${numberClasses}`}>
        {index}
      </span>
      <span className="break-words">{label}</span>
    </button>
  );
};

export default AnswerButton;
