import { useState, useEffect } from 'react';

interface CountdownResult {
  minutes: number;
  seconds: number;
  isExpired: boolean;
  timeLeftMs: number;
}

export const useCountdown = (targetDateIso: string | null): CountdownResult => {
  const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!targetDateIso) {
      setTimeLeftMs(0);
      setIsExpired(true);
      return;
    }

    const targetTime = new Date(targetDateIso).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeftMs(0);
        setIsExpired(true);
      } else {
        setTimeLeftMs(difference);
        setIsExpired(false);
      }
    };

    calculateTimeLeft(); // Initial calculation

    const timerInterval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerInterval);
  }, [targetDateIso]);

  const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeftMs % (1000 * 60)) / 1000);

  return { minutes, seconds, isExpired, timeLeftMs };
};
