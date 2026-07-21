const QuestionCard = ({ question, theme = 'dark' }) => {
  const cardClasses = theme === 'dark'
    ? 'border-slate-800 bg-slate-950/70'
    : 'border-slate-200 bg-slate-50/90';
  const titleClasses = theme === 'dark' ? 'text-slate-100' : 'text-slate-900';
  const textClasses = theme === 'dark' ? 'text-slate-400' : 'text-slate-600';
  const badgeClasses = theme === 'dark'
    ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
    : 'border-cyan-400/30 bg-cyan-50 text-cyan-700';

  return (
    <div className={`rounded-2xl border p-4 ${cardClasses}`}>
      <p className={`text-lg font-semibold leading-7 ${titleClasses}`}>{question.prompt}</p>
      <p className={`mt-3 text-sm leading-6 ${textClasses}`}>{question.context}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${badgeClasses}`}>
          {question.type}
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;
