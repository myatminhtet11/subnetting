const QuestionCard = ({ question }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-lg font-semibold leading-7 text-slate-100">{question.prompt}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{question.context}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          {question.type}
        </span>
      </div>
    </div>
  );
};

export default QuestionCard;
