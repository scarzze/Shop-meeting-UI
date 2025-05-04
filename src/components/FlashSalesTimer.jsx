import React, { useEffect, useState } from 'react';

const FlashSalesTimer = ({ deadline }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(deadline) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 items-center text-sm font-semibold">
      <div className="text-center">
        <div className="text-lg">{String(timeLeft.hours).padStart(2, '0')}</div>
        <div className="text-xs">Hrs</div>
      </div>
      <span>:</span>
      <div className="text-center">
        <div className="text-lg">{String(timeLeft.minutes).padStart(2, '0')}</div>
        <div className="text-xs">Min</div>
      </div>
      <span>:</span>
      <div className="text-center">
        <div className="text-lg">{String(timeLeft.seconds).padStart(2, '0')}</div>
        <div className="text-xs">Sec</div>
      </div>
    </div>
  );
};

export default FlashSalesTimer;
