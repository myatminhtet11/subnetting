export const getExplanation = (question, selectedAnswer) => {
  const baseExplanation = question.explanation || { title: 'Explanation', steps: [] };
  const isCorrect = selectedAnswer === question.answer;

  if (isCorrect) {
    return {
      title: 'Correct answer',
      steps: [`Correct! ${baseExplanation.steps[0] || ''}`, ...baseExplanation.steps.slice(1)],
    };
  }

  return {
    title: baseExplanation.title,
    steps: [
      `The correct answer was ${question.answer}.`,
      ...baseExplanation.steps,
    ],
  };
};
