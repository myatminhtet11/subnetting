const AnswerButton = ({ label, onClick, isSelected, index }) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition sm:px-4 ${
        isSelected
          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-100 shadow-lg shadow-cyan-500/10'
          : 'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-cyan-500/40 hover:bg-slate-800'
      }`}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300">
        {index}
      </span>
      <span className="break-words">{label}</span>
    </button>
  );
};

export default AnswerButton;
