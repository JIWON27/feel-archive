import { useState, useEffect } from 'react';

interface CountdownResult {
  diffDays: number;
  diffHours: number;
  diffMins: number;
  diffSecs: number;
  isExpired: boolean;
}

export function useCountdown(targetDate: Date): CountdownResult {
  const calc = () => {
    const diffMs = targetDate.getTime() - Date.now();
    if (diffMs <= 0) {
      return { diffDays: 0, diffHours: 0, diffMins: 0, diffSecs: 0, isExpired: true };
    }
    return {
      diffDays: Math.floor(diffMs / 86400000),
      diffHours: Math.floor((diffMs % 86400000) / 3600000),
      diffMins: Math.floor((diffMs % 3600000) / 60000),
      diffSecs: Math.floor((diffMs % 60000) / 1000),
      isExpired: false,
    };
  };

  const [state, setState] = useState(calc);

  useEffect(() => {
    const timer = setInterval(() => setState(calc()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return state;
}
