import { useEffect, useState } from 'react';
import AnswerButton from '../components/AnswerButton';
import ExplanationModal from '../components/ExplanationModal';
import InterviewCard from '../components/InterviewCard';
import QuestionCard from '../components/QuestionCard';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';
import { getExplanation } from '../engine/explanations';
import { generateQuestion } from '../engine/questionGenerator';
import { useTimer } from '../hooks/useTimer';

const Home = () => {
  const [started, setStarted] = useState(false);
  const [question, setQuestion] = useState(() => generateQuestion());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [showRetry, setShowRetry] = useState(false);
  const [roundKey, setRoundKey] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { timeLeft } = useTimer(30, roundKey, isPaused);

  const handleAnswer = (option) => {
    if (isAnswered) {
      return;
    }

    setIsAnswered(true);
    setSelectedAnswer(option);

    const isCorrect = option === question.answer;
    if (isCorrect) {
      setScore((previous) => previous + 15 + Math.min(5, streak));
      setStreak((previous) => previous + 1);
      setShowRetry(false);
    } else {
      setStreak(0);
      setShowRetry(true);
    }

    setAnswered((previous) => previous + 1);
    setExplanation(getExplanation(question, option));
    setShowExplanation(true);
  };

  const retryQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setExplanation(null);
    setShowRetry(false);
    setIsAnswered(false);
    setRoundKey((previous) => previous + 1);
  };

  const nextQuestion = () => {
    setQuestion(generateQuestion());
    setSelectedAnswer(null);
    setShowExplanation(false);
    setExplanation(null);
    setShowRetry(false);
    setIsAnswered(false);
    setRoundKey((previous) => previous + 1);
    setQuestionIndex((previous) => previous + 1);
  };

  useEffect(() => {
    if (timeLeft === 0 && !isAnswered) {
      setIsAnswered(true);
      setAnswered((previous) => previous + 1);
      setStreak(0);
      setShowRetry(true);
      setExplanation(getExplanation(question, null));
      setShowExplanation(true);
    }
  }, [isAnswered, question, timeLeft]);

  const themeClasses = isDarkMode
    ? 'bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] text-slate-100'
    : 'bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_30%),linear-gradient(135deg,_#f8fafc_0%,_#e2e8f0_100%)] text-slate-900';

  const cardClasses = isDarkMode
    ? 'border-slate-800/80 bg-slate-900/80 text-slate-100'
    : 'border-slate-200 bg-white/80 text-slate-900';

  const mutedTextClasses = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const secondaryTextClasses = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const controlClasses = isDarkMode
    ? 'border-slate-700 bg-slate-800/80 text-slate-200 hover:border-cyan-500/40 hover:text-cyan-200'
    : 'border-slate-300 bg-white/90 text-slate-700 hover:border-cyan-400 hover:text-cyan-600';

  if (!started) {
    return (
      <div className={`flex min-h-screen items-center justify-center px-4 py-8 ${themeClasses}`}>
        <div className={`relative w-full max-w-xl rounded-[2rem] border p-8 text-center shadow-2xl shadow-black/20 backdrop-blur sm:p-10 ${cardClasses}`}>
          <button
            onClick={() => setIsDarkMode((previous) => !previous)}
            className={`absolute right-4 top-4 rounded-full border p-2 transition ${controlClasses}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Subnetting speed trainer</p>
          <h1 className={`mt-4 text-3xl font-semibold sm:text-4xl ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Ready to sharpen your subnet instincts?
          </h1>
          <p className={`mt-4 text-sm leading-7 sm:text-base ${mutedTextClasses}`}>
            Practice CIDR choices, host checks, subnet overlap, and same-subnet logic in a fast interview-style quiz.
          </p>
          <button
            onClick={() => setStarted(true)}
            className={`mt-8 rounded-full px-6 py-3 text-sm font-semibold transition ${isDarkMode ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400' : 'bg-cyan-600 text-white hover:bg-cyan-500'}`}
          >
            Play now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8 ${themeClasses}`}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <header className={`rounded-[1.5rem] border p-4 shadow-2xl shadow-black/20 backdrop-blur sm:rounded-[2rem] sm:p-6 ${cardClasses}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-400 sm:text-sm">Subnetting speed trainer</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Timer timeLeft={timeLeft} theme={isDarkMode ? 'dark' : 'light'} />
              <div className={`rounded-full border px-3 py-1 text-sm ${isDarkMode ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200' : 'border-cyan-400/30 bg-cyan-50 text-cyan-700'}`}>
                Round {questionIndex + 1}
              </div>
              <button
                onClick={() => setIsPaused((previous) => !previous)}
                className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${controlClasses}`}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={() => setIsDarkMode((previous) => !previous)}
                className={`rounded-full border p-2 transition ${controlClasses}`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        <ScoreBoard />

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
          <InterviewCard title="Current prompt" theme={isDarkMode ? 'dark' : 'light'}>
            <QuestionCard question={question} theme={isDarkMode ? 'dark' : 'light'} />
            <div className="mt-5 grid gap-3">
              {question.options.map((option, index) => (
                <AnswerButton
                  key={option}
                  index={index + 1}
                  label={String(option)}
                  onClick={() => handleAnswer(option)}
                  isSelected={selectedAnswer === option}
                  theme={isDarkMode ? 'dark' : 'light'}
                />
              ))}
            </div>
          </InterviewCard>

          <div className="space-y-4">
            <div className={`rounded-[1.5rem] border p-5 shadow-lg shadow-black/20 ${cardClasses}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Coach note</p>
              <p className={`mt-3 text-sm leading-7 ${secondaryTextClasses}`}>
                Keep the subnet mask, block size, and broadcast boundary in mind. Those three clues will carry most of the quiz.
              </p>
            </div>
            <div className={`rounded-[1.5rem] border p-5 shadow-lg shadow-black/20 ${cardClasses}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Fast tip</p>
              <p className={`mt-3 text-sm leading-7 ${secondaryTextClasses}`}>
                For subnetting questions, the magic number is the block size. If the block fits the host requirement, it is the right answer.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ExplanationModal
        isOpen={showExplanation}
        message={explanation}
        showRetry={showRetry}
        onRetry={retryQuestion}
        onNext={nextQuestion}
        theme={isDarkMode ? 'dark' : 'light'}
      />
    </div>
  );
};

export default Home;
