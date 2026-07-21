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

  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] px-4 py-8 text-slate-100">
        <div className="w-full max-w-xl rounded-[2rem] border border-slate-800/80 bg-slate-900/80 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">Subnetting speed trainer</p>
          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Ready to sharpen your subnet instincts?</h1>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            Practice CIDR choices, host checks, subnet overlap, and same-subnet logic in a fast interview-style quiz.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="mt-8 rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Play now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] px-3 py-4 text-slate-100 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-6">
        <header className="rounded-[1.5rem] border border-slate-800/80 bg-slate-900/80 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:rounded-[2rem] sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-400 sm:text-sm">Subnetting speed trainer</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Timer timeLeft={timeLeft} />
              <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-200">
                Round {questionIndex + 1}
              </div>
              <button
                onClick={() => setIsPaused((previous) => !previous)}
                className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-200"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>
        </header>

        <ScoreBoard />

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-6">
          <InterviewCard title="Current prompt">
            <QuestionCard question={question} />
            <div className="mt-5 grid gap-3">
              {question.options.map((option, index) => (
                <AnswerButton
                  key={option}
                  index={index + 1}
                  label={String(option)}
                  onClick={() => handleAnswer(option)}
                  isSelected={selectedAnswer === option}
                />
              ))}
            </div>
          </InterviewCard>

          <div className="space-y-4">
            <div className="rounded-[1.5rem] border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">Coach note</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Keep the subnet mask, block size, and broadcast boundary in mind. Those three clues will carry most of the quiz.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-800/80 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Fast tip</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
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
      />
    </div>
  );
};

export default Home;
