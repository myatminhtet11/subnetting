import { useEffect, useState } from 'react';

export const useTimer = (initialSeconds = 20, resetKey = 0, isPaused = false) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds, resetKey]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isPaused, timeLeft]);

  return { timeLeft };
};
