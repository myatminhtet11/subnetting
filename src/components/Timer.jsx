const Timer = ({ timeLeft }) => {
  const tone = timeLeft <= 5 ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200';

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold ${tone}`}>
      <span className="text-base">⏱</span>
      <span>{timeLeft}s</span>
    </div>
  );
};

export default Timer;
