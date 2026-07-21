const ExplanationModal = ({ isOpen, message, showRetry, onRetry, onNext }) => {
  if (!isOpen) {
    return null;
  }

  const steps = message?.steps || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
      <div className="w-full max-w-2xl rounded-[1.5rem] border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/40">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">{message?.title || 'Explanation'}</p>
        <div className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <div key={`${step}-${index}`} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm leading-7 text-slate-300">
              <span className="mr-2 font-semibold text-cyan-300">{index + 1}.</span>
              {step}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {showRetry ? (
            <button
              onClick={onRetry}
              className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20"
            >
              Retry this question
            </button>
          ) : null}
          <button
            onClick={onNext}
            className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Next question
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
