const ExplanationModal = ({ isOpen, message, showRetry, onRetry, onNext, theme = 'dark' }) => {
  if (!isOpen) {
    return null;
  }

  const steps = message?.steps || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6">
      <div className={`w-full max-w-2xl rounded-[1.5rem] border p-6 shadow-2xl shadow-black/40 ${theme === 'dark' ? 'border-slate-800 bg-slate-900 text-slate-100' : 'border-slate-200 bg-white text-slate-900'}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">{message?.title || 'Explanation'}</p>
        <div className="mt-4 space-y-3">
          {steps.map((step, index) => (
            <div key={`${step}-${index}`} className={`rounded-2xl border p-3 text-sm leading-7 ${theme === 'dark' ? 'border-slate-800 bg-slate-950/70 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
              <span className="mr-2 font-semibold text-cyan-400">{index + 1}.</span>
              {step}
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {showRetry ? (
            <button
              onClick={onRetry}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${theme === 'dark' ? 'border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20' : 'border-amber-400/40 bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
            >
              Retry this question
            </button>
          ) : null}
          <button
            onClick={onNext}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${theme === 'dark' ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-cyan-600 text-white hover:bg-cyan-500'}`}
          >
            Next question
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
